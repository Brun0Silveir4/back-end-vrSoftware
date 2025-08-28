const statusMap = new Map();

function saveStatus(id, status) {
  statusMap.set(id, status);
}

function getStatus(id) {
  return statusMap.has(id) ? statusMap.get(id) : null;
}

// Apenas para testes unitários
function resetStatus() {
  statusMap.clear();
}

module.exports = { saveStatus, getStatus, resetStatus };
