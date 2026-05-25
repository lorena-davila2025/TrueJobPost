const { execSync } = require('child_process');
try {
  execSync('git checkout -- src/App.tsx', { stdio: 'inherit' });
  console.log("Restored successfully");
} catch (e) {
  console.error("Error restoring", e);
}
