import { SecretValue, Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as codebuild from 'aws-cdk-lib/aws-codebuild'
import {
	App,
	GitHubSourceCodeProvider,
	RedirectStatus,
} from '@aws-cdk/aws-amplify-alpha'

interface HostingStackProps extends StackProps {
	readonly owner: string
	readonly repository: string
	readonly githubOauthTokenName: string
	readonly environmentVariables?: { [name: string]: string }
}

export class HostingStack extends Stack {
	constructor(scope: Construct, id: string, props: HostingStackProps) {
		super(scope, id, props)
		//https://.d31xw924ohrfr1.amplifyapp.com Not sure how to set 'main' as the production branch name
		const amplifyApp = new App(this, 'MyNewApp', {
			appName: 'NextJS from CDK',
			sourceCodeProvider: new GitHubSourceCodeProvider({
				owner: props.owner,
				repository: props.repository,
				oauthToken: SecretValue.secretsManager(props.githubOauthTokenName),
			}),
			autoBranchDeletion: true,
			customRules: [
				{
					source: '/<*>',
					target: '	/index.html',
					status: RedirectStatus.NOT_FOUND_REWRITE,
				},
			],
			environmentVariables: props.environmentVariables,
			buildSpec: codebuild.BuildSpec.fromObjectToYaml({
				version: 1,
				frontend: {
					phases: {
						preBuild: {
							commands: ['npm ci'],
						},
						build: {
							commands: ['npm run build'],
						},
					},
					artifacts: {
						baseDirectory: '.next',
						files: ['**/*'],
					},
					cache: {
						paths: ['node_modules/**/*'],
					},
				},
			}),
		})

		amplifyApp.addBranch('main', {
			branchName: 'main',
		})
	}
}
