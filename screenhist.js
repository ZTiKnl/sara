module.exports = {
  wipe: function () {
    // 1. Print empty lines until the screen is blank.
    process.stdout.write('\033[2J');

    // 2. Clear the scrollback.
    process.stdout.write('\u001b[H\u001b[2J\u001b[3J');
  }
}