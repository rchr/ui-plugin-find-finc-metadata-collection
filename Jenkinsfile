@Library ('folio_jenkins_shared_libs') _

buildNPM {
  publishModDescriptor = true
  runRegression = false
  runLint = true
  runSonarqube = false
  runTest = false
  runTestOptions = '--karma.singleRun --karma.browsers ChromeDocker --karma.reporters mocha junit --coverage'
}