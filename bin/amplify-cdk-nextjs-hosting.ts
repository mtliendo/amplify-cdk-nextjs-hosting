#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { HostingStack } from '../lib/hostingStack'

const app = new cdk.App()
new HostingStack(app, 'AmplifyCdkNextjsHostingStack', {
	githubOauthTokenName: 'github-token',
	owner: 'mtliendo',
	repository: 'simple-nextjs',
	environmentVariables: { name: 'michael', place: 'henry' },
})
