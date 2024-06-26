pipeline {
    agent none
    environment {
        SNYK_CREDENTIALS = credentials('SnykToken')
    }
    stages {
        stage('Secret Scanning Using Trufflehog') {
            agent {
                docker {
                    image 'trufflesecurity/trufflehog:latest'
                    args '-u root --entrypoint='
                }
            }
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    sh 'trufflehog filesystem . --only-verified --exclude-paths trufflehog-excluded-paths.txt --fail > trufflehog-scan-result.txt'
                }
                sh 'cat trufflehog-scan-result.txt'
                archiveArtifacts artifacts: 'trufflehog-scan-result.txt'
            }
        }
        stage('Build') {
            agent {
              docker {
                  image 'node:lts-buster-slim'
              }
            }
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            agent {
              docker {
                  image 'node:lts-buster-slim'
              }
            }
            steps {
                sh 'echo test'
            }
        }
        stage('SAST SonarQube') {
            agent {
              docker {
                  image 'sonarsource/sonar-scanner-cli:latest'
                  args '--network host -v ".:/usr/src" --entrypoint='
              }
            }
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    sh 'sonar-scanner -Dsonar.projectKey=zapphireyefrontend -Dsonar.qualitygate.wait=true -Dsonar.sources=. -Dsonar.host.url=http://192.168.1.18:9000 -Dsonar.token=sqp_7cf0495a6e3db080e2e5cbddadfb2918921ab178' 
                }
            }
        }
        stage('Build Docker Image') {
            agent {
                docker {
                    image 'docker:dind'
                    args '--user root --network host -v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                sh 'echo Lamongan117 | docker login -u fadly31 --password-stdin'
                sh 'docker build -t fadly31/zapphireyefrontend .'
                sh 'docker push fadly31/zapphireyefrontend'
            }
        }
         stage('Deploy Docker Image') {
            agent {
                docker {
                    image 'kroniak/ssh-client'
                    args '--user root --network host'
                }
            }
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: "DeploymentSSHKey", keyFileVariable: 'keyfile')]) {
                    sh 'ssh -i ${keyfile} -o StrictHostKeyChecking=no fadly@192.168.1.18 "echo Lamongan117 | docker login -u fadly31 --password-stdin"'
                    sh 'ssh -i ${keyfile} -o StrictHostKeyChecking=no fadly@192.168.1.18 docker pull fadly31/nodegoat'
                    sh 'ssh -i ${keyfile} -o StrictHostKeyChecking=no fadly@192.168.1.18 docker rm --force nodegoat'
                    sh 'ssh -i ${keyfile} -o StrictHostKeyChecking=no fadly@192.168.1.18 docker run -it --detach -p 4321:4321 --name zapphireyefrontend --network host fadly31/nodegoat'
                }
            } 
         }
   }
}
