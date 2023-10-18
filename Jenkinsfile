pipeline {
    environment {
        SKIP_CODE_SCAN = "${params.SKIP_CODE_SCAN}"
        SKIP_AUTOMATE_TEST = "${params.SKIP_AUTOMATE_TEST}"
        SYSTEM_NAME = "${params.SYSTEM_NAME}"
        SERVICE_NAME = "${params.SERVICE_NAME}"
        VERSIONDEV = "${params.VERSIONdev}"+"${env.BUILD_NUMBER}"
        VERSIONUAT = "${params.VERSIONuat}"+"${env.BUILD_NUMBER}"
        VERSIONPRD = "${params.VERSIONProd}"+"${env.BUILD_NUMBER}"
		IMAGE_NAMEDEV = "${params.REGISTRY_CREDENTIAL}/${params.REGISTRY}:${VERSIONDEV}"
        IMAGE_NAMEUAT = "${params.REGISTRY_CREDENTIAL}/${params.REGISTRY}:${VERSIONUAT}"
        IMAGE_NAMEPRD = "${params.REGISTRY_CREDENTIAL}/${params.REGISTRY}:${VERSIONPRD}"

        DOCKER_USER = "${params.DOCKER_USER}"
		DOCKER_PASSWORD = "${params.DOCKER_PASSWORD}"
        TOKEN = "${params.TOKEN}"
    }
    agent any
    stages {
        /* stage('code quality scan') {
            when {
                environment name: 'SKIP_CODE_SCAN', value: 'false'
            }
            steps {
              step([$class: 'DescribeWithParamsBuilder', starter: 'true', separator: '', excludes: 'SYSTEM_NAME;SERVICE_NAME'])
                script {
                    def scannerHome = tool 'sonar-scanner';
                    withSonarQubeEnv() {
                        sh "${scannerHome}/bin/sonar-scanner " +
                        "-Dsonar.qualitygate.wait " +
                        "-Dsonar.projectKey=${SYSTEM_NAME}-${SERVICE_NAME} " +
                        "-Dsonar.projectName=${SYSTEM_NAME}-${SERVICE_NAME} " +
                        "-Dsonar.sourceEncoding=UTF-8 " +
                        "-Dsonar.sources=. " +
                        '-Dsonar.exclusions=".git/**, .vscode/**, cypress/**"'
                    }
                }
            }
        }
        stage("Quality Gate") {
            when {
                environment name: 'SKIP_CODE_SCAN', value: 'false'
                }
            steps {
                script {
                    def qg = waitForQualityGate() Reuse taskId previously collected by withSonarQubeEnv
                    if (qg.status != 'OK') {
                        echo "See report from URL: http://scancode.pt.co.th/dashboard?id=${SYSTEM_NAME}-${SERVICE_NAME}"
                        currentBuild.result = "FAILURE"
                        error "Pipeline aborted due to quality gate failure: ${qg.status}"
                    }
                    echo "See report from URL: https://scancode.pt.co.th/dashboard?id=${SYSTEM_NAME}-${SERVICE_NAME}"
                }
            }
        }
        stage('Automate Test') {
            when {
                environment name: 'SKIP_AUTOMATE_TEST', value: 'false'
            }
            steps {
                script {
                    nodejs(nodeJSInstallationName: 'NodeJS20') {
                        sh "npm -v"
                        sh "npm i"
                        sh "npm run ci"
                        archiveArtifacts artifacts: 'cypress/videos/spec.cy.ts.mp4', fingerprint: true
                    }
                }
            }
        }*/
        stage('Build docker image') {
            steps {  
                sh "docker build -t ${IMAGE_NAMEDEV} -f Dockerfile ."
            }
        }
		stage('Approval Deploy to DEV cluster'){
            steps{
                input "Please Approval with deployment"
            }
        }
        stage('Push image to Registry container') {
            steps{
				sh "docker login devuatwarpad.azurecr.io --username '${DOCKER_USER}' --password '${DOCKER_PASSWORD}'"
                sh "docker push ${IMAGE_NAMEDEV}"
            }
        }
		stage('Replace image to DEV yaml') {
			steps{
				script{
					def config = readYaml file: "Deployment.yaml"
					config.spec.template.spec.containers[0].image = IMAGE_NAMEDEV
					writeYaml file: "Deployment.yaml", data: config, overwrite: true
					sh "cat Deployment.yaml"
				}
			}
		}
		stage('Deploy to DEV cluster') {
			steps{
				kubeconfig(caCertificate: '', credentialsId: 'k8s-credential-dev-2023', serverUrl: '') {
					script{
						try {
							sh "kubectl delete -f Deployment.yaml"
							sh "kubectl delete -f Service.yaml"
							sh "kubectl delete -f Hpa.yaml"
							sh "kubectl apply -f Deployment.yaml"
							sh "kubectl apply -f Service.yaml"
							sh "kubectl apply -f Hpa.yaml"
						} catch (err) {
							echo err.getMessage()
							sh "kubectl apply -f Deployment.yaml"
							sh "kubectl apply -f Service.yaml"
							sh "kubectl apply -f Hpa.yaml"
						}
					}
				}
			}
		}
		stage('Approval Deploy to UAT cluster'){
            steps{
                input "Please Approval with deployment"
            }
        }
        stage('reteg DEV to UAT'){
            steps{
                sh "docker tag ${IMAGE_NAMEDEV} ${IMAGE_NAMEUAT}"
            }
        }

        stage('push image UAT') {
            steps{
                sh "docker push "+ "${IMAGE_NAMEUAT}"
            }
        }
        stage('Replace image to UAT yaml') {
			steps{
				script{
					def config = readYaml file: "Deployment-uat.yaml"
					config.spec.template.spec.containers[0].image = IMAGE_NAMEUAT
					writeYaml file: "Deployment-uat.yaml", data: config, overwrite: true
					sh "cat Deployment-uat.yaml"
				}
			}
		}
		stage('Deploy to UAT cluster') {
			steps{
				kubeconfig(caCertificate: '', credentialsId: 'k8s-credential-uat-2023', serverUrl: '') {
					script{
						try {
							sh "kubectl delete -f Deployment-uat.yaml"
							sh "kubectl delete -f Service-uat.yaml"
							sh "kubectl delete -f Hpa-uat.yaml"
							sh "kubectl apply -f Deployment-uat.yaml"
							sh "kubectl apply -f Service-uat.yaml"
							sh "kubectl apply -f Hpa-uat.yaml"
						} catch (err) {
							echo err.getMessage()
							sh "kubectl apply -f Deployment-uat.yaml"
							sh "kubectl apply -f Service-uat.yaml"
							sh "kubectl apply -f Hpa-uat.yaml"
						}
					}
				}
			}
		}
		stage('Approval Deploy to Production cluster'){
            steps{
                input "Please Approval with deployment"
            }
        }
        stage('reteg UAT to PRD'){
            steps{
                sh "docker tag ${IMAGE_NAMEUAT} ${IMAGE_NAMEPRD}"
            }
        }

        stage('push image PRD') {
            steps{
                sh "docker push "+ "${IMAGE_NAMEPRD}"
            }
        }
         stage('Replace image to Production yaml') {
			steps{
				script{
					def config = readYaml file: "Deployment-prd.yaml"
					config.spec.template.spec.containers[0].image = IMAGE_NAMEPRD
					writeYaml file: "Deployment-prd.yaml", data: config, overwrite: true
					sh "cat Deployment-prd.yaml"
				}
			}
		}
		stage('Deploy to Production cluster') {
			steps{
				kubeconfig(caCertificate: '', credentialsId: 'k8s-credential-prd-2023', serverUrl: '') {
					script{
						try {
							sh "kubectl delete -f Deployment-prd.yaml"
							sh "kubectl delete -f Service-prd.yaml"
							sh "kubectl delete -f Hpa-prd.yaml"
							sh "kubectl apply -f Deployment-prd.yaml"
							sh "kubectl apply -f Service-prd.yaml"
							sh "kubectl apply -f Hpa-prd.yaml"
						} catch (err) {
							echo err.getMessage()
							sh "kubectl apply -f Deployment-prd.yaml"
							sh "kubectl apply -f Service-prd.yaml"
							sh "kubectl apply -f Hpa-prd.yaml"
						}
					}
				}
			}
		}
    }
}