pipeline {
    agent any

    environment {
        NODE_ENV = 'development'
        DOCKER_IMAGE_NAME = 'abdel2334/social_media_blog_platform_project'
        DOCKER_CREDENTIALS_ID = 'dckr_pat_oUcmfKGZ8HTmeYyfYyjW6uCLMSM'
    }

    stages {
        stage('Checkout') {
            steps {
							// Configure Git to use a larger buffer
                    sh 'git config --global http.postBuffer 524288000'
                    sh 'git config --global http.maxRequestBuffer 100M'
                // Clone the repository
                git branch: 'backendProject2', url: 'https://github.com/abdeLKabir-56/wander.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                script {
                    // Install Node.js dependencies
                    sh 'npm install'
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    // Run tests (update the script if you add actual tests)
                    sh 'npm test'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker image
                    sh "docker build -t ${DOCKER_IMAGE_NAME}:latest ."
                }
            }
        }
        stage('Docker Login') {
            steps {
                script {
                    // Login to Docker Hub
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    }
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    // Push Docker image to Docker Hub
                    sh "docker push ${DOCKER_IMAGE_NAME}:latest"
                }
            }
        }
        stage('Deploy with Docker Compose') {
            steps {
                script {
                    // Deploy the application using Docker Compose
                    sh 'docker-compose up -d'
                }
            }
        }
    }

    post {
        always {
            script {
                // Cleanup workspace and Docker containers
                cleanWs()
                sh 'docker-compose down'
            }
        }
        success {
            echo 'Build, Docker image push, and deployment successful!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
