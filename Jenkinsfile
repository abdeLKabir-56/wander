pipeline {
    agent any

    environment {
        NODE_ENV = 'development'
        DOCKER_IMAGE_NAME = 'abdel2334/social_media_blog_platform_project'
        DOCKERHUB_CREDENTIALS = credentials('dockerhub_id')
    }

    stages {
        stage('Clean Workspace') {
            steps {
                echo 'Cleaning workspace'
                deleteDir() // Clean up the workspace
            }
        }

        stage('Checkout') {
            steps {
                echo 'Checkout step'
                sh '''
                git config --global http.postBuffer 524288000
                git config --global http.maxRequestBuffer 100M
                git clone -b backendProject2 https://github.com/abdeLKabir-56/wander.git .
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Install Dependencies step'
                sh 'npm install --legacy-peer-deps'
            }
        }

        stage('Test') {
            steps {
                echo 'Test step'
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Build Docker Image step'
                sh "docker build -t ${DOCKER_IMAGE_NAME}:latest ."
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub_id', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    echo 'Push Docker Image step'
                    sh "docker push ${DOCKER_IMAGE_NAME}:latest"
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                echo 'Deploy with Docker Compose step'
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        always {
            cleanWs()
            sh 'docker-compose down'
        }
        success {
            echo 'Build, Docker image push, and deployment successful!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
