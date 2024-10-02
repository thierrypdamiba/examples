require('dotenv').config({ path: '.env.local' });

const { fetchAllData } = require('./zoomapi');
const { spawn } = require('child_process');
const path = require('path');
const readline = require('readline');

async function runPythonScript(scriptPath, args = []) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [scriptPath, ...args], {
            env: {
                ...process.env,
                PYTHONUNBUFFERED: '1'
            }
        });
        
        let output = '';
        let errorOutput = '';

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
            console.error(`Python debug output: ${data}`);  // Print debug output
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python script exited with code ${code}\nError: ${errorOutput}\nOutput: ${output}`));
            } else {
                resolve(output.trim());
            }
        });
    });
}

async function insertData() {
    console.log("Starting data insertion process...");
    try {
        const data = await fetchAllData();
        console.log("All data fetched, now triggering Qdrant insertion.");
        
        // Run the insert.py script
        await runPythonScript('vector/insert.py');
        
        console.log("Data insertion complete.");
    } catch (error) {
        console.error("Error during data insertion:", error);
        throw error;
    }
}

async function queryLoop() {
    while (true) {
        const query = await askQuestion('Enter your query (or type "exit" to quit): ');
        if (query.toLowerCase() === 'exit') {
            console.log('Exiting query loop.');
            break;
        }
        
        try {
            const result = await runPythonScript('vector/query.py', [query]);
            let parsedResult;
            try {
                parsedResult = JSON.parse(result);
            } catch (parseError) {
                console.error('Error parsing Python script output:', result);
                console.error('Parse error:', parseError);
                continue;
            }
            
            if (parsedResult.error) {
                console.error('Error:', parsedResult.error);
            } else {
                console.log('\n' + '='.repeat(50));
                console.log(`Query: ${parsedResult.query}`);
                console.log('='.repeat(50));
                console.log('\nAnswer:');
                console.log(parsedResult.answer);
                console.log('\n' + '='.repeat(50) + '\n');
            }
        } catch (error) {
            console.error('Error running query:', error.message);
        }
    }
}

async function main() {
    try {
        await insertData();
        console.log('Data inserted into Qdrant.');
        await queryLoop();
    } catch (error) {
        console.error('Error in main process:', error);
    }
}

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

main();