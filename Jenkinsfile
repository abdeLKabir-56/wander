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
                    echo 'Building Docker image...'
                    bat "docker build -t ${DOCKER_IMAGE_NAME}:latest . || exit 1"
                }
            }
        }
        stage('Login to Docker Hub') {
            steps {
                script {
                    echo 'Logging in to Docker Hub...'
                    withCredentials([usernamePassword(credentialsId: 'dockerhub_id', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        bat """
                         docker login -u %DOCKER_USERNAME% -p %DOCKER_PASSWORD%
                        """
                    }
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    echo 'Pushing Docker image...'
                    bat "docker push ${DOCKER_IMAGE_NAME}:latest"
                }
            }
        }
        stage('Deploy with Docker Compose') {
            steps {
                script {
                    echo 'Deploying with Docker Compose...'
                    bat 'docker-compose -f C:/Users/info/Desktop/social_media_blog_platform_project/docker-compose.yml up -d'
                }
            }
        }
    }

    post {
        always {
            script {
                bat 'docker-compose -f C:/Users/info/Desktop/social_media_blog_platform_project/docker-compose.yml down'
            }
            cleanWs() // Clean up the workspace
        }
        success {
            echo 'Build, Docker image push, and deployment successful!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
