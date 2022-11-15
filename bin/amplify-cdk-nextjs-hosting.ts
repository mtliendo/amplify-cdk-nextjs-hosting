#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { HostingStack } from '../lib/hostingStack'

const app = new cdk.App()
new HostingStack(app, 'AmplifyCdkNextjsHostingStack', {
	githubOauthToken: '',
	owner: '',
	repository: '',
	environmentVariables: { name: 'michael', place: 'henry' },
})
