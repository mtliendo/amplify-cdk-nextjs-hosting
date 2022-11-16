#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { HostingStack } from '../lib/hostingStack'

const app = new cdk.App()

new HostingStack(app, 'AmplifyCdkNextjsHostingStack2', {
	githubOauthTokenName: 'github-token', //name given to plaintext secret in secretsManager
	owner: 'mtliendo',
	repository: 'simple-nextjs',
	environmentVariables: { name: 'michael', place: 'Midwest' },
})

// 🚨 Temporary: Until the construct has support to add the platform, run the following CLI command AFTER deploying to use SSRV2:

// aws amplify update-app --app-id THE_APP_ID --platform WEB_COMPUTE

// subsequent nextJS 12+ builds will now work.
