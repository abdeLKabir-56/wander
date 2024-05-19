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
          sh 'npm install --legacy-peer-deps'
        }
      }
    }
    stage('Test') {
      steps {
        script {
          echo 'Test step'
          // Run tests (update the script if you add actual tests)
          sh 'npm test'
        }
      }
    }
    stage('Build Docker Image') {
      steps {
        script {
          echo 'Building step'
          // Build Docker image
          sh "docker build -t ${env.DOCKER_IMAGE_NAME}:latest ."
        }
      }
    }
    stage('Login to Docker Hub (Optional)') {
      // This stage is optional, uncomment if you want to explicitly login before pushing
      steps {
        script {
          if (env.DOCKERHUB_CREDENTIALS) {
            withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
              sh "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
            }
          } else {
            echo "No Docker Hub credentials found. Skipping login."
          }
        }
      }
    }
    stage('Push Docker Image') {
      steps {
        script {
          echo 'Image push step'
          // Check if credentials are available before pushing
          if (env.DOCKERHUB_CREDENTIALS) {
            sh "docker push ${env.DOCKER_IMAGE_NAME}:latest"
          } else {
            echo "No Docker Hub credentials found. Skipping push."
          }
        }
      }
    }
    stage('Deploy with Docker Compose') {
      steps {
        script {
          echo 'Image deploy step'
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
