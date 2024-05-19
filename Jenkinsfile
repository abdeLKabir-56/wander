pipeline {
    agent any

    environment {
        NODE_VERSION = '14' // Specify the Node.js version
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
                git branch: 'backendProject2', url: 'https://github.com/abdeLKabir-56/wander.git'
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
                // Run tests (update the script if you add actual tests)
                sh 'npm test'
            }
        }
        stage('Build Docker Image') {
            steps {
                echo 'Building step'
                // Build Docker image
                sh "docker build -t ${env.DOCKER_IMAGE_NAME}:latest ."
            }
        }
        stage('Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    echo 'Logging into Docker Hub'
                    sh 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                echo 'Image push step'
                // Push Docker image to Docker Hub
                sh "docker push ${env.DOCKER_IMAGE_NAME}:latest"
            }
        }
        stage('Deploy with Docker Compose') {
            steps {
                echo 'Image deploy step'
                // Deploy the application using Docker Compose
                sh 'docker-compose up -d'
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
