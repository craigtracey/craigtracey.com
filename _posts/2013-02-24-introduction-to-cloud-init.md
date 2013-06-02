---
layout: post
status:
published: true
title: "Cloud-Init: The early-initialization tool you didn’t even know you needed"
author: Craig Tracey
date: 2013-02-24 18:15:03.000000000 -08:00
categories: ['aws', 'cloud', 'openstack']
tags: []
---
At a relatively recent cloud automation meetup I was pretty surprised to find out that a lot of folks were not using (and many unaware of) the [EC2 metadata service](http://docs.amazonwebservices.com/AWSEC2/latest/UserGuide/AESDG-chapter-instancedata.html).  As this small piece has been relatively crucial to the way that we bootstrap our instances, I thought it might make sense to post about what it is, how we have used it and where we plan to take it.

In a nutshell, the EC2 metadata service provides instance-specific data about an instance to the instance through a link-local API endpoint. Or, in English, it is a service that we can query for data about the instance the service is called from.  All kinds of data is available - MAC address, hostname, public hostname, kernel id, ami id, etc., etc.  Having this data at your disposal is critical when you are trying to automate at scale.

Want to take a look? Just fire up curl on any instance you have running in EC2. The URL is the same regardless of the instance you are running on:

{% highlight bash %}
[ctracey@somehost ~]$ curl http://169.254.169.254/latest/meta-data/
ami-id
ami-launch-index
ami-manifest-path
block-device-mapping/
hostname
instance-action
instance-id
instance-type
kernel-id
local-hostname
local-ipv4
mac
metrics/
network/
placement/
profile
public-hostname
public-ipv4
public-keys/
reservation-id
{% endhighlight %}

In addition to the metadata offered by the cloud provider, each also provides a "userdata" mechanism - a place to write whatever data you might want. In the case of EC2, the user is provided a single 16K block of text that they can essentially "attach" to a newly created instance.  This data can be (literally) anything, and is unsurprisingly, the most powerful part of the metadata service.

Back is 2009 <a title="Alestic" href="http://alestic.com" target="_blank">alestic</a> popularized the use of this userdata block for executing what they termed a "user-data-script" at some point post-boot. Presumably, this would be sourced or executed from rc.local or some other point in the boot/init process.  For example:

{% highlight bash %}
[ctracey@somehost ~]: curl http://169.254.169.254/latest/user-data 2> /dev/null
hostname somehost.example.com
{% endhighlight %}

{% highlight bash %}
[ctracey@somehost ~]: cat /etc/rc.local
USER_DATA_FILE=$(mktemp)
curl http://169.254.169.254/latest/user-data 2>/dev/null > $USER_DATA_FILE
source $USER_DATA_FILE
rm -f $USER_DATA_FILE
{% endhighlight %}

This is just an example of how one could use userdata to do something like setting a hostname. Seems simple enough, right? For those of you using configuration management like <a title="Chef" href="http://opscode.com">Chef</a> or <a title="Puppet" href="http://puppetlabs.com">Puppet</a>, this small step is critical for getting instances provisioned properly.

But what about when you need to do something a bit more complex? Configuring Puppet to point to the Puppet master, or upgrading all of the packages that have been baked into your golden image, or even dropping specific user's SSH keys on the instance are all run-of-the-mill tasks that any operator will undoubtedly want to do. Extrapolating on the simple example above, we can obviously extend the bash script to do all of these things, but before long, this script would certainly start to take on a monolithic life of its own - hard to maintain and probably less than ideal to debug should the need arise.

And, while this mechanism is supported by both <a title="AWS" href="http://aws.amazon.com">AWS</a> and <a title="OpenStack" href="http://openstack.org">OpenStack</a>, there are other solutions out there. For instance, it looks like many in the OpenStack community favor the use of <a title="Config Drive" href="http://docs.openstack.org/trunk/openstack-compute/admin/content/config-drive.html">Config Drive</a>. Same underlying idea, but instead of being presented as a HTTP endpoint, the data is presented just as the name implies: as a drive. Certainly there are reasons that some prefer one mechanism over the next. But, whether we like it or not, AWS is "the bar," so I don't foresee the use of userdata HTTP endpoints going away anytime soon.

So this begs the question - given this 16K block of raw data, how can we build a customizable and scalable early initialization mechanism? Enter <a title="cloud-init" href="http://launchpad.net/cloud-init/">cloud-init</a> from the fine folks at <a title="Canonical" href="http://canonical.com">Canonical</a>.  As the name implies, this is a framework for initializing cloud instances.  It allows you to make use of the cloud provider's meta/userdata services to effectively instruct an instance how you expect it to deviate from the image upon boot.  This could mean resetting the ssh fingerprint, setting up DNS, or even bootstrapping your configuration management.

Which begs the second question - why do I need this, I already use Puppet/Chef/CFEngine?  Unfortunately, while these are really awesome tools in their own right, they often come at the price of having to install/configure them before a first run.  For instance, Puppet, by default, requires that your hostname be set and that you have a Puppet master that resolves to short name 'puppet.'  Well what if you don't want your instance to be known as ec2-24-34-54-64.compute-1.amazonaws.com? (Sorry to whomever that may be) And, as for resolving 'puppet,' that may prove difficult if you don't have access to modify DNS appropriately.  So, you are forced to configure your instances.

This (while not recommended) is doable by-hand when you have a small number of instances.  Or, even doable if you bake their configuration into an image.  But, when you start to scale out to hundreds and thousands of instances, these techniques just don't cut it.  So, we need a way to bootstrap these instances, and that is precisely what cloud-init is providing.
<h3>OK, so how does it work?</h3>
In order to use cloud-init in its most basic form, we need to perform 3 simple steps:
<ol>
	<li>Install cloud-init into our base image.</li>
	<li>Generically configure cloud-init.</li>
	<li>Provide userdata to a newly booted instance.</li>
</ol>
Yep, that is it.  Let's look at them one by one.

<b>Install cloud-init into our base image.</b>

First installing the package into the image should be relatively straight-forward.  How you do this will depend on what tools you are using to create your images.  Some people will use EBS-backed public AMI's in AWS.  (There are many reasons why I would <strong>not</strong> recommend this, but this is a topic for a later post).  In this case you would likely install cloud-init into your shiny new instance and then move to Step 2.  (The same sorts of techniques may be used for Rackspace Public and Private Cloud solutions)

Alternatively, you can create your own AMI or <insert image format of choice/> typically from a preseed or kickstart file.  As we use CentOS quite heavily, kickstarts are our thing, and we leverage a <a title="tool" href="https://github.com/katzj/ami-creator">tool</a> from a good friend (<a title="Jeremy Katz" href="http://velohacker.com">Jeremy Katz</a>) to create said images.  In either case, you will simply add 'cloud-init' to the package section of your preseed/kickstart file before building.

<b>Generically configure cloud-init.</b>

That brings us to Step 2. At this point, you have a base image with cloud-init and the default cloud-init configuration. If you are happy with the default configuration found in /etc/cloud/cloud.cfg, then you are good-to-go. If not you will want to make changes to this file.  This is critical as this will impact all future runs of cloud-init for instances based upon this image.  So, take your time to understand the various configuration options.  Here is what the default config file may look like:

{% highlight bash %}
# The top level settings are used as module
# and system configuration.

# A set of users which may be applied and/or used by various modules
# when a 'default' entry is found it will reference the 'default_user'
# from the distro configuration specified below
users:
   - default

# If this is set, 'root' will not be able to ssh in and they
# will get a message to login instead as the above $user (ubuntu)
disable_root: true

# This will cause the set+update hostname module to not operate (if true)
preserve_hostname: false

# Example datasource config
# datasource:
#    Ec2:
#      metadata_urls: [ 'blah.com' ]
#      timeout: 5 # (defaults to 50 seconds)
#      max_wait: 10 # (defaults to 120 seconds)

# The modules that run in the 'init' stage
cloud_init_modules:
 - migrator
 - bootcmd
 - write-files
 - resizefs
 - set_hostname
 - update_hostname
 - update_etc_hosts
 - ca-certs
 - rsyslog
 - users-groups
 - ssh

# The modules that run in the 'config' stage
cloud_config_modules:
# Emit the cloud config ready event
# this can be used by upstart jobs for 'start on cloud-config'.
 - emit_upstart
 - mounts
 - ssh-import-id
 - locale
 - set-passwords
 - grub-dpkg
 - apt-pipelining
 - apt-configure
 - package-update-upgrade-install
 - landscape
 - timezone
 - puppet
 - chef
 - salt-minion
 - mcollective
 - disable-ec2-metadata
 - runcmd
 - byobu

# The modules that run in the 'final' stage
cloud_final_modules:
 - rightscale_userdata
 - scripts-per-once
 - scripts-per-boot
 - scripts-per-instance
 - scripts-user
 - ssh-authkey-fingerprints
 - keys-to-console
 - phone-home
 - final-message
 - power-state-change

# System and/or distro specific settings
# (not accessible to handlers/transforms)
system_info:
   # This will affect which distro class gets used
   distro: ubuntu
   # Default user name + that default users groups (if added/used)
   default_user:
     name: ubuntu
     lock_passwd: True
     gecos: Ubuntu
     groups: [adm, audio, cdrom, dialout, floppy, video, plugdev, dip, netdev]
     sudo: [&quot;ALL=(ALL) NOPASSWD:ALL&quot;]
     shell: /bin/bash
   # Other config here will be given to the distro class and/or path classes
   paths:
      cloud_dir: /var/lib/cloud/
      templates_dir: /etc/cloud/templates/
      upstart_dir: /etc/init/
   package_mirrors:
     - arches: [i386, amd64]
       failsafe:
         primary: http://archive.ubuntu.com/ubuntu
         security: http://security.ubuntu.com/ubuntu
       search:
         primary:
           - http://%(ec2_region)s.ec2.archive.ubuntu.com/ubuntu/
           - http://%(availability_zone)s.clouds.archive.ubuntu.com/ubuntu/
         security: []
     - arches: [armhf, armel, default]
       failsafe:
         primary: http://ports.ubuntu.com/ubuntu-ports
         security: http://ports.ubuntu.com/ubuntu-ports
   ssh_svcname: ssh
{% endhighlight %}

As you can probably guess, this YAML file controls which configuration modules get run and when.  It is also responsible for defining many system-wide settings.  For instance, should the root user be disabled?  Which package mirrors to use, etc.

<b><em>RedHat users note well that you will need to define the distro being used in this configuration file.  By default this is set to Ubuntu (it is a Canonical project after all).  Failing to change this will probably yield a bunch of errors down the road.  So take care of it now.</em></b>

At the time of this writing, "officially" supported distros are Debian/Ubuntu and RHEL/Fedora.  While cloud-init may incorporate some kind of OS introspection in the future, for now you must define it.  And, defining it upfront has the advantage of allowing support for descendant distros (ie. CentOS users could use distro: rhel).

<b>Provide userdata to a newly booted instance.</b>

And finally we reach step 3.  This is where we instruct cloud-init what to do when it runs.  Again, we use YAML to describe the actions to be taken, and each of these declarations are based upon what is supported by the various modules.  Here is an example:

{% highlight bash %}
#cloud-config
manage_etc_hosts: True
manage_resolv_conf: True

resolv_conf:
  nameservers: ['8.8.8.8', '8.8.4.4']
  searchdomains:
    - example.com
  options:
    rotate: true
    timeout: 1

fqdn: somehost.example.com
puppet:
  version: '3.0.2'
  conf:
    agent:
      server: mypuppetmaster.example.com
{% endhighlight %}

The layout of this data begins with the '#cloud-config' statement.  This identifies for cloud-init that the data to follow is there for cloud-init's consumption.  If this tag is not there, cloud-init will ignore the rest of the data.

As you might imagine, this configuration is doing a few things - managing /etc/hosts, managing /etc/resolv.conf, setting a hostname, and configuring puppet.  In this case, each of these are configured once - during the first boot.  Depending on the module, this may happen more often. Be sure to check the modules you are interested in to determine how often they will run.

As of this writing, cloud-init supports three frequencies:
- PER_ONCE: run one time only
- PER_ALWAYS: always run
- PER_INSTANCE: run once for this specific instance ID. (This is useful for the case where an instance is snapshotted and then cloned)

For more information about what modules are available, be sure to check out the <a href="http://cloudinit.readthedocs.org/en/latest/">docs</a>. These are updated frequently, so be sure to check back often.

Once you have the configuration you want, you will need to boot your instances with the userdata available to the cloud provider. Here are some ways to do this:

EC2:
{% highlight bash %}
ec2-run-instances --key mysshkey --user-data-file <path_to_user_data_file> ami-12345678
{% endhighlight %}

OpenStack:
{% highlight bash %}
nova boot --flavor <flavor> --image <image id> --user-data <path_to_user_data_file> somehost
{% endhighlight %}

And, of course, this is also a mechanism provided by each of the respective GUI's (AWS Management Console and Horizon) as well as though any of the cloud API's.

In these examples I am showing cloud-init being used with the traditional EC2-like userdata service.  Cloud-init has another great feature: this data can come from a multitude of sources - CloudStack, MAAS, OVF, ConfigDrive, and flat files just to name a few.  And, of course, if you have another source that you would like to support, being open source, you are free to add your own.

<h2>Conclusion</h2>

All in all, we have found that we have gained a great deal of leverage by incorporating cloud-init into our bootstrap process.  As we run instances and baremetal nodes in a variety of datacenters/cloud providers, cloud-init has given us the ability to mostly abstract away our early init bootstrapping.  This is critical for us to make sense of this hybrid environment.  Hopefully you will find it just as useful.

Questions or comments about cloud-init? Be sure to leave a comment and join the conversation.
