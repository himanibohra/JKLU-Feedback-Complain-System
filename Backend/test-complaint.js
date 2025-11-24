const http = require('http');

function makeRequest(method, path, data = null, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8080,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

async function testComplaintCreation() {
    try {
        const testEmail = 'testuser' + Date.now() + '@test.com';
        const testPassword = 'Test123!';

        // Step 1: Register a new user
        console.log('Step 1: Registering new user...');
        const registerResponse = await makeRequest('POST', '/api/auth/register', {
            name: 'Test User',
            email: testEmail,
            password: testPassword,
            role: 'student'
        });

        console.log('Registration response:', registerResponse);

        // Step 2: Login to get token
        console.log('\nStep 2: Logging in...');
        const loginResponse = await makeRequest('POST', '/api/auth/login', {
            email: testEmail,
            password: testPassword
        });

        if (loginResponse.status !== 200) {
            console.error('Login failed:', loginResponse);
            return;
        }

        const token = loginResponse.data.token;
        console.log('Login successful! Token:', token.substring(0, 20) + '...');

        // Step 3: Create a complaint
        console.log('\nStep 3: Creating complaint...');
        const complaintData = {
            title: 'Test Complaint - ' + new Date().toISOString(),
            description: 'This is a test complaint to verify database insertion',
            category_id: '1',
            location: 'Test Location',
            priority: 'normal',
            is_anonymous: 'false'
        };

        console.log('Complaint data:', complaintData);

        const createResponse = await makeRequest('POST', '/api/complaints', complaintData, token);

        console.log('\nCreate Response Status:', createResponse.status);
        console.log('Create Response:', createResponse.data);

        if (createResponse.status === 200 || createResponse.status === 201) {
            console.log('\n✅ SUCCESS: Complaint created!');
        } else {
            console.log('\n❌ FAILED: Complaint not created');
        }

        // Step 4: Fetch complaints to verify
        console.log('\nStep 4: Fetching complaints...');
        const fetchResponse = await makeRequest('GET', '/api/complaints', null, token);

        console.log('Fetch Response Status:', fetchResponse.status);
        console.log('Complaints fetched:', fetchResponse.data);

        const totalComplaints = fetchResponse.data.pagination?.total || fetchResponse.data.data?.length || 0;
        console.log('Total complaints:', totalComplaints);

        if (totalComplaints > 0) {
            console.log('\n✅ SUCCESS: Complaint is visible in the list!');

            // Step 5: Add a comment
            const complaintId = fetchResponse.data.data[0].id;
            console.log(`\nStep 5: Adding comment to complaint ${complaintId}...`);

            const commentData = {
                content: 'This is a test comment'
            };

            const commentResponse = await makeRequest('POST', `/api/complaints/${complaintId}/comments`, commentData, token);
            console.log('Comment Response Status:', commentResponse.status);
            console.log('Comment Response:', commentResponse.data);

            if (commentResponse.status === 200) {
                console.log('\n✅ SUCCESS: Comment added!');
            } else {
                console.log('\n❌ FAILED: Comment not added');
            }

            // Step 6: Fetch complaint details
            console.log(`\nStep 6: Fetching details for complaint ${complaintId}...`);
            const detailResponse = await makeRequest('GET', `/api/complaints/${complaintId}`, null, token);
            console.log('Detail Response Status:', detailResponse.status);
            console.log('Detail Response:', JSON.stringify(detailResponse.data, null, 2));

            if (detailResponse.status === 200 && detailResponse.data.id) {
                console.log('\n✅ SUCCESS: Complaint details fetched!');
            } else {
                console.log('\n❌ FAILED: Could not fetch details');
            }

        } else {
            console.log('\n❌ PROBLEM: No complaints found in the list!');
        }

    } catch (error) {
        console.error('\n=== ERROR ===');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
    }
}

testComplaintCreation();
