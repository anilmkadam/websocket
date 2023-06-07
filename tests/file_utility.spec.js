const assert = require('assert');
const fs = require('fs').promises;
const FileUtility = require('../utility/file_utility');

describe('readLastNLines', function() {
    // Set up the file path to use for the tests
    const filePath = '../log/sample.log';
    const fileUtil = new FileUtility();
    // Create a test file with some content before each test
    beforeEach(async function() {
    await fs.writeFile(filePath, 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\nLine 7\nLine 8\nLine 9\nLine 10\n');
    });

    // Delete the test file after each test
    afterEach(async function() {
    await fs.unlink(filePath);
    });

    it('should read the last line of a file', async function() {
    const result = await fileUtil.readLastNLines(filePath, 1);
    assert.strictEqual(result, 'Line 10\n');
    });

    it('should read the last two lines of a file', async function() {
    const result = await fileUtil.readLastNLines(filePath, 2);
    assert.strictEqual(result, 'Line 9\nLine 10\n');
    });

    it('should read the last five lines of a file', async function() {
    const result = await fileUtil.readLastNLines(filePath, 5);
    assert.strictEqual(result, 'Line 6\nLine 7\nLine 8\nLine 9\nLine 10\n');
    });

    it('should throw an error if the file does not exist', async function() {
    try {
        await fileUtil.readLastNLines('./non-existent-file.txt', 1);
        assert.fail('Expected an error to be thrown');
    } catch (error) {
        assert.strictEqual(error.message, 'File does not exist');
    }
    });
});
