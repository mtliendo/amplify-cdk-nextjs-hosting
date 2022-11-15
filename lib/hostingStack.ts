import { SecretValue, Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as codebuild from 'aws-cdk-lib/aws-codebuild'
import { App, GitHubSourceCodeProvider } from '@aws-cdk/aws-amplify-alpha'

interface HostingStackProps extends StackProps {
	readonly owner: string
	readonly repository: string
	readonly githubOauthToken: string
	readonly environmentVariables?: { [name: string]: string }
}

export class HostingStack extends Stack {
	constructor(scope: Construct, id: string, props: HostingStackProps) {
		super(scope, id, props)

		const amplifyApp = new App(this, 'MyApp', {
			sourceCodeProvider: new GitHubSourceCodeProvider({
				owner: props.owner,
				repository: props.repository,
				oauthToken: SecretValue.secretsManager(props.githubOauthToken),
			}),
			autoBranchDeletion: true,
			environmentVariables: props.environmentVariables,
			buildSpec: codebuild.BuildSpec.fromObjectToYaml({
				version: '1.0',
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
						files: -'**/*',
					},
					cache: {
						paths: ['node_modules/**/*'],
					},
				},
			}),
		})
	}
}
