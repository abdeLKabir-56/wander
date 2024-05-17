pipeline {
    agent any

    environment {
        NODE_ENV = 'development'
        DOCKER_IMAGE_NAME = 'abdel2334/social_media_blog_platform_project'
        DOCKER_CREDENTIALS_ID = 'dckr_pat_oUcmfKGZ8HTmeYyfYyjW6uCLMSM'
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
                bat '''
                git config --global http.postBuffer 524288000
                git config --global http.maxRequestBuffer 100M
                git clone -b backendProject2 https://github.com/abdeLKabir-56/wander.git .
                '''
            }
        }
         stage('Install Dependencies') {
            steps {
                script {
                    echo 'Install Dependencies step'
                    // Install Node.js dependencies with legacy-peer-deps flag
                    bat 'npm install --legacy-peer-deps'
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    echo 'Test step'
                    // Run tests (update the script if you add actual tests)
                    bat 'npm test'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building step'
                    // Build Docker image
                    bat "docker build -t %DOCKER_IMAGE_NAME%:latest ."
                }
            }
        }
        stage('Docker Login') {
            steps {
                script {
                    echo 'Docker hub auth'
                    // Login to Docker Hub
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'abdel2334', passwordVariable: 'dckr_pat_oUcmfKGZ8HTmeYyfYyjW6uCLMSM')]) {
                        bat 'echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin'
                    }
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    echo 'Image push step'
                    // Push Docker image to Docker Hub
                    bat "docker push %DOCKER_IMAGE_NAME%:latest"
                }
            }
        }
        stage('Deploy with Docker Compose') {
            steps {
                script {
                    echo 'Image deploy step'
                    // Deploy the application using Docker Compose
                    bat 'docker-compose up -d'
                }
            }
        }
    }

    post {
        always {
            script {
                // Cleanup workspace and Docker containers
                cleanWs()
                bat 'docker-compose down'
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
