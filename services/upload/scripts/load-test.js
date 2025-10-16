#!/usr/bin/env node

/**
 * Load Test Script for Upload Service
 * Tests concurrent upload capacity
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const UPLOAD_URL = 'http://localhost:3005/api/v1/uploads';
const TEST_FILE_SIZE = 1024 * 1024; // 1MB test file
const CONCURRENT_UPLOADS = process.argv[2] || 10;

// Create a test file
function createTestFile(size = TEST_FILE_SIZE) {
  const buffer = Buffer.alloc(size, 'A');
  const filePath = path.join(__dirname, 'test-file.txt');
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

// Single upload function
async function uploadFile(fileId) {
  const filePath = createTestFile();
  const form = new FormData();

  form.append('files', fs.createReadStream(filePath), {
    filename: `test-file-${fileId}.txt`,
    contentType: 'text/plain'
  });

  form.append('entityType', 'DOCUMENT');
  form.append('entityId', `test-${fileId}`);
  form.append('accessLevel', 'PRIVATE');

  const startTime = Date.now();

  try {
    const response = await axios.post(UPLOAD_URL, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': 'Bearer test-token' // Mock token
      },
      timeout: 30000 // 30 second timeout
    });

    const duration = Date.now() - startTime;

    return {
      id: fileId,
      success: true,
      duration,
      status: response.status,
      fileId: response.data?.data?.id
    };
  } catch (error) {
    const duration = Date.now() - startTime;

    return {
      id: fileId,
      success: false,
      duration,
      error: error.message,
      status: error.response?.status || 'TIMEOUT'
    };
  } finally {
    // Cleanup test file
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

// Load test function
async function runLoadTest(concurrentUploads) {
  console.log(`🚀 Starting load test with ${concurrentUploads} concurrent uploads...`);
  console.log(`📁 Test file size: ${TEST_FILE_SIZE / 1024}KB`);
  console.log(`🎯 Target URL: ${UPLOAD_URL}`);
  console.log('');

  const startTime = Date.now();

  // Create array of upload promises
  const uploadPromises = Array.from({ length: concurrentUploads }, (_, i) =>
    uploadFile(i + 1)
  );

  // Execute all uploads concurrently
  const results = await Promise.allSettled(uploadPromises);

  const totalDuration = Date.now() - startTime;

  // Analyze results
  const successful = results.filter(r => r.status === 'fulfilled' && r.value.success);
  const failed = results.filter(r => r.status === 'rejected' || !r.value?.success);

  const successfulResults = successful.map(r => r.value);
  const failedResults = failed.map(r => r.status === 'fulfilled' ? r.value : { error: r.reason?.message });

  // Calculate statistics
  const successRate = (successful.length / concurrentUploads) * 100;
  const avgDuration = successfulResults.length > 0
    ? successfulResults.reduce((sum, r) => sum + r.duration, 0) / successfulResults.length
    : 0;
  const minDuration = successfulResults.length > 0
    ? Math.min(...successfulResults.map(r => r.duration))
    : 0;
  const maxDuration = successfulResults.length > 0
    ? Math.max(...successfulResults.map(r => r.duration))
    : 0;

  // Print results
  console.log('📊 LOAD TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`Total uploads attempted: ${concurrentUploads}`);
  console.log(`Successful uploads: ${successful.length}`);
  console.log(`Failed uploads: ${failed.length}`);
  console.log(`Success rate: ${successRate.toFixed(2)}%`);
  console.log(`Total test duration: ${totalDuration}ms`);
  console.log('');

  if (successfulResults.length > 0) {
    console.log('⏱️  TIMING STATISTICS');
    console.log('-'.repeat(30));
    console.log(`Average response time: ${avgDuration.toFixed(2)}ms`);
    console.log(`Fastest response: ${minDuration}ms`);
    console.log(`Slowest response: ${maxDuration}ms`);
    console.log('');
  }

  if (failedResults.length > 0) {
    console.log('❌ FAILURE ANALYSIS');
    console.log('-'.repeat(30));

    const errorCounts = {};
    failedResults.forEach(result => {
      const errorType = result.status || result.error || 'Unknown';
      errorCounts[errorType] = (errorCounts[errorType] || 0) + 1;
    });

    Object.entries(errorCounts).forEach(([error, count]) => {
      console.log(`${error}: ${count} failures`);
    });
    console.log('');
  }

  // Performance assessment
  console.log('🎯 PERFORMANCE ASSESSMENT');
  console.log('-'.repeat(30));

  if (successRate >= 95) {
    console.log('✅ EXCELLENT: System handled the load well');
  } else if (successRate >= 80) {
    console.log('⚠️  GOOD: System handled most requests but some failures');
  } else if (successRate >= 50) {
    console.log('🚨 POOR: System struggled with the load');
  } else {
    console.log('💥 CRITICAL: System failed under load - needs optimization');
  }

  if (avgDuration < 2000) {
    console.log('✅ Response times are acceptable (<2s average)');
  } else if (avgDuration < 5000) {
    console.log('⚠️  Response times are slow (2-5s average)');
  } else {
    console.log('🚨 Response times are too slow (>5s average)');
  }

  console.log('');
  console.log('💡 RECOMMENDATIONS');
  console.log('-'.repeat(30));

  if (successRate < 90) {
    console.log('• Increase database connection pool');
    console.log('• Increase Redis connection pool');
    console.log('• Add rate limiting to prevent overload');
    console.log('• Implement queue backpressure');
  }

  if (avgDuration > 3000) {
    console.log('• Optimize file processing pipeline');
    console.log('• Use streaming uploads instead of buffering');
    console.log('• Add CDN for faster file delivery');
    console.log('• Scale horizontally with load balancer');
  }
}

// Run the test
if (require.main === module) {
  runLoadTest(parseInt(CONCURRENT_UPLOADS))
    .then(() => {
      console.log('Load test completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Load test failed:', error);
      process.exit(1);
    });
}

module.exports = { runLoadTest, uploadFile };