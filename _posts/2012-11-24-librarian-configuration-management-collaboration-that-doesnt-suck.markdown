---
layout: post
status:
published: true
title: "librarian: Configuration Management Collaboration that Doesn't Suck"
author: Craig
date: 2012-11-24 07:00:41.000000000 -08:00
categories: ['puppet', 'chef', 'devops']
tags: []
comments: []
---
I have recently taken to develop a new strategy for our [Chef](http://www.opscode.com) deployments at work.  (Yes, we use both, and no we are not crazy).  In particular, we have a keen interest in making use of third-party open source modules in addition to those that are specific to our needs.  Apart from many of the benefits that we would take advantage of by using open source, we are also looking to improve upon some of the modules already out there.  There is no secret sauce to this stuff, lots of folks will likely manage their configurations similar to the way that we do, so why not?

One thing that I, personally, had struggled with is keeping track of/making sense of following third party repositories.  It's not that it is particularly hard to do, it just ends up consuming a lot of (mostly) unnecessary cycles. Many times, the projects that I had looked to fork on [GitHub](http://github.com) were actually projects comprised of a multitude of git submodules.  For anyone who has dealt with projects of this nature, I am sure that you can attest to the fact that things will get ugly - and quickly!  Don't get me wrong, git submodules certainly have their place, but, in my opinion, this is not the most contributor-friendly model out there.  Dealing with a git commitish, as opposed to an actual branch or tag name, quickly leads to confusion and makes your work error-prone.  Similarly, I don't always need or want a whole repository - sometimes it's just that one directory three levels deep that strikes my fancy.  With git submodules, its all or none.  While I love (and recommend) git, this would be one area where I think workflows could be improved.

But, I digressed, so back to my problem - I want to be able to deploy configuration management manifests/cookbooks that come from a variety of sources.  To clarify, let me paint a picture of what something like this might look like.  Take for instance [Chef](https://github.com/opscode/openstack-chef-repo) repositories are available.  Each of these repositories are comprised of modules for a multitude of components; from block storage, to compute services, object storage, identity management, and beyond.  In addition, each of these components have their own dependencies - mysql, rabbitmq, etc, etc.  And, this is list is only growing!  So, I think you get my drift...it's a LOT to juggle all at once!

Naturally, to manage this sort of repository you would want to keep each of these modules separate, so that they can advance at an appropriate pace for the module, but also under "one roof" in order to manage a complete deployment.  The difficulty, for me, comes when I have a specific need that is not covered by one these submodules.  Naturally, I want to fork just this particular submodule, make my change, and, if appropriate, submit a pull request back to the original project.  Unfortunately, it's just not always that simple.  If the parent project is comprised of git submodules and I still want to keep things under that "one roof,"  I now have to fork both the parent project and the submodule.  In doing so with git submodules, because the submodules are tied to a specific commitish, I have now essentially frozen (even if briefly) my repository in time.  Sure, I can update each of the submodules, but this can be painful.  Do I want that change?  Does this update work with my changes? etc.  I am typically pretty confident that my fix (or one like it) will eventually make it as an accepted pull request, but that timeframe is often somewhat indeterminate.  How long will I be maintaining this fork of the parent repo?  Long story short, I simply don't want the maintenance overhead that I have just (mostly innocently) incurred.

Looking for something better, I stumbled upon librarian, from [repo](https://github.com/opscode/openstack-chef-reporepo):

{% highlight ruby %}
#!/usr/bin/env ruby
#^syntax detection

site 'http://community.opscode.com/api/v1'

cookbook 'ntp', '1.2.0'
cookbook 'openssh', '1.1.0'
cookbook 'apt', '1.5.0'
cookbook 'yum', '1.0.0'
cookbook 'build-essential', '1.1.2'
cookbook 'erlang', '1.1.0'
cookbook 'openssl', '1.0.0'
cookbook 'postgresql', '1.0.0'
cookbook 'aws', '0.100.2'
cookbook 'xfs', '1.0.0'
cookbook 'database', '1.3.6'
cookbook 'mysql', '1.3.0'
cookbook 'rabbitmq', '1.6.4'
cookbook 'apache2', '1.2.0'
cookbook 'selinux', '0.5.2'

cookbook 'sysctl',
  :git => 'https://github.com/mattray/sysctl.git'

cookbook 'osops-utils',
  :git => 'https://github.com/mattray/osops-utils.git'

cookbook 'rabbitmq-openstack',
  :git => 'https://github.com/mattray/rabbitmq-openstack.git'

cookbook 'mysql-openstack',
  :git => 'https://github.com/mattray/mysql-openstack.git'

cookbook 'keystone',
  :git => 'https://github.com/mattray/keystone.git',
  :ref => '2012.1.0'

cookbook 'glance',
 :git => 'https://github.com/mattray/glance.git',
 :ref => '2012.1.0'

cookbook 'nova',
 :git => 'https://github.com/mattray/nova.git',
 :ref => '2012.1.0'

cookbook 'horizon',
 :git => 'https://github.com/mattray/horizon.git',
 :ref => '2012.1.0'
{% endhighlight %}

This is what a typical Cheffile would look like. And, naturally, a Puppetfile looks similar. Here we can see that there are a number of dependencies that are being pulled in from the Opscode Community site. In addition, there are a number of OpenStack-specific repos being used (rabbitmq-openstack and mysql-openstack) and keystone, OpenStack's identity service, being called with a ref. Fantastic.

To "build" this librarian configuration file, all I need to do is simply install librarian via gem, and issue a single command:

{% highlight bash %}
ctracey@ctracey-desktop:~/src/openstack-chef-repo$ sudo gem install librarian
...
ctracey@ctracey-desktop:~/src/openstack-chef-repo$ librarian-chef install
Installing apache2 (1.2.0)
Installing apt (1.5.0)
Installing aws (0.100.2)
Installing build-essential (1.1.2)
Installing openssl (1.0.0)
Installing mysql (1.3.0)
Installing postgresql (1.0.0)
Installing xfs (1.0.0)
Installing database (1.3.6)
Installing yum (1.0.0)
Installing erlang (1.1.0)
Installing ntp (1.2.0)
Installing openssh (1.1.0)
Installing rabbitmq (1.6.4)
Installing selinux (0.5.2)
Installing osops-utils (1.0.6)
Installing keystone (2012.1.0)
Installing glance (2012.1.0)
Installing horizon (2012.1.0)
Installing mysql-openstack (1.0.4)
Installing sysctl (0.1.0)
Installing nova (2012.1.0)
Installing rabbitmq-openstack (1.0.4)
{% endhighlight %}

And now, from this extremely lightweight mechanism I have just pulled source from various repositories. My cookbooks directory is populated with all of the cookbooks installed above, including all dependencies.

But what about the problem I was trying to solve earlier? Let's imagine that I have found an issue with the way that Nova is configured. In this case I would still need to fork both the nova and openstack-chef-repo repositories. But, there is a very subtle (and powerful) difference. Because the Cheffile is not indicating a specific commit to follow, as you would get with git submodules, I now have the freedom to follow openstack-chef-repo while enabling my own local changes.  By simply replacing:

{% highlight ruby %}
cookbook 'nova',
  :git => 'https://github.com/mattray/nova.git',
  :ref => '2012.1.0'
{% endhighlight %}

with...

{% highlight ruby %}
cookbook 'nova',
  :git => 'https://github.com/craigtracey/nova.git',
  :ref => 'myminorchange'
{% endhighlight %}

I am able to get my change relatively smoothly into production. I am not in the business of periodically updating each module - only in maintaining those modules where I have changes. Once my pull request is accepted, I can then re-follow the original Cheffile and I have easily moved back to master. This is fantastic.

Now if the "master" Cheffile were to call out a specific commitish as a ref, then sure, we are back to the same scenario we find with git submodules. But, at least in the example above, the closest we get to something like that is a branch name as a ref. I am happy periodically update my fork of the Cheffile to pickup any changes to the ref's.

As I mentioned earlier, I have implemented this for our new Puppet builds. In this case, I have written an extremely simple bash script that runs in our Jenkins CI environment. It essentially executes the commands above, tars the result, and drops it into my artifact repository. This, accompanied by a fabric deployment script, allows me to (in parallel) drop the tarball on each of my Puppet masters, and quickly roll out new configuration management code.

There have been a few bumps in getting this to work end-to-end, but overall I am extremely happy with the end result. My sanity (or what little is left) remains intact, I am leveraging open source configuration management code, pushing necessary changes back to the community, utilizing a tool that works similarly across both Puppet and Chef, and have a very reliable configuration management deployment solution. Life, for now, is good.
