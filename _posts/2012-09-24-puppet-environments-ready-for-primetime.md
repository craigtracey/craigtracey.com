---
layout: post
published: true
title: Puppet environments ready for primetime?
author: Craig
date: 2012-09-24 00:37:53.000000000 -07:00
categories: ['puppet']
tags: []
comments: []
---
So I recently implemented [Puppet](http://www.puppetlabs.org/) environments at work in order to save myself the pain of having to build out a whole new puppet infrastructure.  We have an adequate production environment that manages both the QA and Production side of things.  And, for the most part, we can classify each AWS instance into any number of coarse-grained, yet well-defined, classes.  This works great.

The part that turns out to be a bit harder is testing Puppet changes “in the wild.”  Sure, a lot of folks would advocate physical separation of your testing and production environments, but why do that when we have Puppet environments?  And, so it was done.

I have to say that at first I was quite pleased with how the environments were working for us.  I could quickly push a set of changes from my own private repository, and in a matter of just a few seconds, be testing in my own Puppet environment.  This worked great for most everything I needed to do…with one <em>big</em> exception.

Puppet in our release (2.6.13) does not correctly (at least in my mind) support environments with certain types of ENC’s.  Where this bit me hard was in serving files from Puppet itself.  As serving files in this manner does not explicitly set the environment at runtime, each agent will be served data from the (default) production environment.  This is all documented in [Bug #3910](http://projects.puppetlabs.com/issues/3910).

While we certainly will not be dropping Puppet anytime soon, this does impede our progress a bit.  And, as I discovered, this is not well documented, so be forewarned.
