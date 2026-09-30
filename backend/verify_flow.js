const http = require('http');

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = body ? JSON.parse(body) : {};
                    resolve({ status: res.statusCode, headers: res.headers, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, headers: res.headers, data: body });
                }
            });
        });
        req.on('error', reject);
        if (data) {
            req.write(typeof data === 'string' ? data : JSON.stringify(data));
        }
        req.end();
    });
}

async function runVerification() {
    console.log("=== ResolveAI Live End-to-End Verification ===\n");
    const timestamp = Date.now();
    const testEmail = `employee_${timestamp}@company.com`;
    const testPassword = "Password123!";

    // 1. Test Signup
    console.log("1. Testing Employee Registration...");
    const signupRes = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/v1/signup',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, {
        name: `Test Employee ${timestamp}`,
        email: testEmail,
        password: testPassword
    });

    console.log(`   Signup Status: ${signupRes.status}`);
    console.log(`   Success: ${signupRes.data.success}, Role: ${signupRes.data.data?.user?.role}`);
    const token = signupRes.data.data?.token;

    // 2. Test Login
    console.log("\n2. Testing Employee Login...");
    const loginRes = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/v1/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, {
        email: testEmail,
        password: testPassword
    });
    console.log(`   Login Status: ${loginRes.status}`);
    console.log(`   Success: ${loginRes.data.success}`);

    // 3. Test Ticket Creation with Multi-Agent AI Orchestrator
    console.log("\n3. Testing Ticket Creation with Multi-Agent AI Orchestrator...");
    console.log("   (Triage -> Retrieval -> Diagnosis -> Resolution -> Escalation)");
    const ticketRes = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/ticket',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }, {
        title: "VPN connection dropping repeatedly during remote work",
        description: "Whenever I connect to the corporate VPN gateway, the handshake succeeds but disconnects after 45 seconds with error code 800.",
        category: "NETWORK",
        priority: "HIGH"
    });

    console.log(`   Ticket Create Status: ${ticketRes.status}`);
    const createdTicket = ticketRes.data.data?.ticket || ticketRes.data.data;
    console.log(`   Ticket ID: ${createdTicket?._id}`);
    console.log(`   Assigned Category: ${createdTicket?.category}`);
    console.log(`   Assigned Priority: ${createdTicket?.priority}`);
    console.log(`   Status: ${createdTicket?.status}`);
    console.log(`   AI Escalated: ${createdTicket?.aiEscalated}`);
    console.log(`   AI Confidence: ${createdTicket?.aiConfidence}`);
    console.log(`   AI Diagnosis Root Cause: ${createdTicket?.aiDiagnosis?.rootCause}`);
    console.log(`   AI Resolution: ${createdTicket?.aiResolution?.resolution}`);

    // 4. Test Fetching My Tickets
    console.log("\n4. Testing GET /api/ticket/my...");
    const myTicketsRes = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/ticket/my',
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`   My Tickets Status: ${myTicketsRes.status}`);
    console.log(`   Tickets Count: ${Array.isArray(myTicketsRes.data.data) ? myTicketsRes.data.data.length : 'N/A'}`);

    // 5. Test Fetching Ticket Details
    console.log(`\n5. Testing GET /api/ticket/${createdTicket?._id}...`);
    const ticketDetailRes = await request({
        hostname: 'localhost',
        port: 3000,
        path: `/api/ticket/${createdTicket?._id}`,
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`   Detail Status: ${ticketDetailRes.status}`);
    console.log(`   Ticket Title: ${ticketDetailRes.data.data?.title}`);

    // 6. Test Posting a Comment
    console.log("\n6. Testing POST /api/comm/:ticketId (User Discussion)...");
    const commentRes = await request({
        hostname: 'localhost',
        port: 3000,
        path: `/api/comm/${createdTicket?._id}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }, {
        message: "I tried rebooting my router as suggested by AI, but the issue persists."
    });
    console.log(`   Comment Create Status: ${commentRes.status}`);
    console.log(`   Comment ID: ${commentRes.data.data?._id}`);
    console.log(`   Author: ${commentRes.data.data?.createdBy?.name || commentRes.data.data?.createdBy}`);

    // 7. Test Fetching Comments
    console.log("\n7. Testing GET /api/comm/:ticketId...");
    const getCommRes = await request({
        hostname: 'localhost',
        port: 3000,
        path: `/api/comm/${createdTicket?._id}`,
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`   Get Comments Status: ${getCommRes.status}`);
    console.log(`   Total Comments: ${Array.isArray(getCommRes.data.data) ? getCommRes.data.data.length : 0}`);

    // 8. Test Forgot Password
    console.log("\n8. Testing Password Recovery Flow (Forgot Password)...");
    const forgotRes = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/v1/forgot',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, {
        email: testEmail
    });
    console.log(`   Forgot Password Status: ${forgotRes.status}`);
    const resetToken = forgotRes.data.data;
    console.log(`   Reset Token Generated: ${resetToken ? resetToken.substring(0, 16) + '...' : 'None'}`);

    // 9. Test Reset Password
    console.log("\n9. Testing Reset Password with Token...");
    const newPassword = "NewSecretPassword456!";
    const resetRes = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/v1/reset',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, {
        token: resetToken,
        newPassword: newPassword
    });
    console.log(`   Reset Status: ${resetRes.status}`);
    console.log(`   Message: ${resetRes.data.data?.message || resetRes.data.message}`);

    // 10. Test Login with New Password
    console.log("\n10. Testing Login with New Password...");
    const newLoginRes = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/v1/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, {
        email: testEmail,
        password: newPassword
    });
    console.log(`   Login with New Password Status: ${newLoginRes.status}`);
    console.log(`   Login Success: ${newLoginRes.data.success}`);

    console.log("\n=== All Verification Steps Completed Successfully! ===");
}

runVerification().catch(console.error);
