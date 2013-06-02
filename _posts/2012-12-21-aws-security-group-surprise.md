---
layout: post
status:
published: true
title: AWS Security Group Surprise
author: Craig Tracey
date: 2012-12-21 07:21:32.000000000 -08:00
categories: ['aws', 'devops']
tags:
comments: []
---
Today we ran into something interesting in our EC2 environment, and I thought I would share.

Having been relatively large consumers of AWS for a number of years, I have to admit that we were a bit surprised to suffer a self-inflicted wound for what was to be a completely innocuous and routine change.  This week we decided to embark on outstanding work to address some security group rules that could be consolidated as well as address locking down an unnecessarily open port. No immediate concerns, just an exercise in good clean living.

So, we spent the week making sure we have thought of all the possibilities.  AWS security groups allow a maximum of 100 rules per group.  Some of the instances that we have had in circulation for some time had only a single group attached.  So, as you can imagine, one-off rules can compile over time.  Realizing that we had a few dedicated address ranges, we converged single host rules to CIDR block rules.

Similarly, even though we had done this a million times prior, the engineer tasked with performing this work filed a support ticket to verify that we should see no ill effects from adjusting security group rules in the manner we intended to do so.  Sure enough, we got the green light:

>"Regarding your question, how long does it takes to apply changes to a security group?
>It should be immediate, unless you have a many rules to apply and many instances are associated with that security group which may take sometime for these changes to propagate in our system.
>But if you have few additions/deletions to a security group and few instances are using it, the changes should be effective immediately."

The sum of our changes would amount to 5 additions and 10 removals across roughly 100 instances...nothing major here whatsoever. The reason we asked how long this process would take was not so much that we were under tight time constraints, but more so because we wanted to know how long before we could (reasonably) declare victory.

Before this bulk change, we did identify a few unrelated one-off rules that could use some tweaking.  So, with our plan in-hand and testing under our belt, we began to execute some changes.  A second later, this rule had been applied and completed successfully.  We tested and things looked OK.

And then the inevitable happened - a few minutes later alerts started firing in our environment.  We checked a few things and sure enough, our monitoring system had caught a small number of hosts (across AZ's) that were failing connectivity.  Worse, these events would be logically different than what we had just changed - different services entirely. But, just as quickly as we were notified, the environment started cleaning itself.

"OK, that was weird timing for an AWS networking blip," we thought.  Because we had already confirmed our change, and because the alerts came in a few minutes after this confirmation (our check interval is less than that), and because this was touching services we hadn't touched, we attributed this to something on the AWS side.  I ran to Twitter, Freenode, and even the AWS status page.  All was clear. (Note: don't rely on the AWS status page) But, things were back, so we decided to watch and wait before moving on.

Once our internal comfort level had composed itself, we decided to move on to the real change.  Again, 5 additions, 10 removals, 100 instances.  We pushed.

Yet again, things looked great...at first.  A few minutes later, we again had unrelated services reporting a loss in connectivity.  Coincidence again? Probably not.

So we tested a single instance with both a single security group and with two security groups.  We ran a full suite of network testing.  Sure enough, we saw complete and unrelated loss of connectivity to this host very briefly.  This was a bit startling for us - regardless of whether we were adding access or removing it, it looks as if there is certainly a brief period of time where instances in said security groups will be subject to losses in connectivity.

While we are extremely resilient in the face of a network flap, we also measure all kinds of failures.  And, perhaps our alerts are a bit tight - better safe than sorry I guess.  Unsurprisingly, where we saw the most "damage" was in those components that make use of persistent connections.  These failed inexplicably at first, but is now, without a doubt, related to the security group change.

Because this behavior does not seem to be documented, nor were we warned of this, we re-engaged AWS via chat. Here was the response:

>"Unfortunately a few seconds of networking connectivity issue is expected as your rules are rebuilt and redeployed for you.  I will put in a documentation review for you on this issue, we do recommend that you bench test your application on our infrastructure to prepare you for how your application will react to changes."

While I appreciate the explanation, we did find that the connectivity loss seemed to be directly correlated to the size of the change both with respect to numbers of rules changed as well as the footprint of instances the changes are applied to.  Similarly, we did not see a consistent loss of connectivity across the group.  So, unless you plan to test at the same scale, I am not sure you would even catch such a problem through testing, as recommended by AWS.

Another compounding factor here was the fact that we scripted the change with a bash script that made use of the ec2-api-tools.  (This was done so that we would have a clear upgrade and rollback path.) With these tools there is no way to bulk modify the security group.  So, the script iterated over the changes; instantiating a new process for each rule.  With that comes the overhead of re-authing each time.  This extended the time it would have taken to apply the rules, and probably created a bit more thrashing than we would have applied had we known about this limitation.  In the future we will make use of boto to auth once before bulk-applying any new rulesets.

So, let our failure be a lesson for those architecting for EC2.  You need to understand that there exists the potential for downtime.  Try, too, to make any changes as efficient as possible - use boto if able or the management console to apply largish sets of rules.
