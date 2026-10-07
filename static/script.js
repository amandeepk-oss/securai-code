async function runAudit() {
    const codeInput = document.getElementById('codeInput').value.trim();
    const languageSelect = document.getElementById('languageSelect').value;

    const placeholderState = document.getElementById('placeholderState');
    const loadingState = document.getElementById('loadingState');
    const reportContent = document.getElementById('reportContent');

    if (!codeInput) {
        alert("Kripya audit ke liye thoda code paste karein!");
        return;
    }

    // Toggle States: Loading Show Karein
    placeholderState.classList.add('hidden');
    reportContent.classList.add('hidden');
    loadingState.classList.remove('hidden');

    try {
        const response = await fetch('/api/v1/audit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: codeInput,
                language: languageSelect
            })
        });

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();

        // Render Results
        document.getElementById('scoreVal').innerText = `${data.security_score}/100`;
        document.getElementById('riskVal').innerText = data.risk_level;
        document.getElementById('summaryVal').innerText = data.summary;
        document.getElementById('fixedCodeVal').innerText = data.fixed_code;

        // Render Vulnerabilities List
        const vulnList = document.getElementById('vulnList');
        vulnList.innerHTML = '';

        if (data.vulnerabilities && data.vulnerabilities.length > 0) {
            data.vulnerabilities.forEach(v => {
                const item = document.createElement('div');
                item.className = 'bg-slate-950 border border-slate-800 p-3 rounded-lg space-y-1';
                item.innerHTML = `
                    <div class="flex items-center justify-between">
                        <span class="font-semibold text-rose-400 text-sm">${v.issue}</span>
                        <span class="text-xs bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">${v.severity}</span>
                    </div>
                    <p class="text-xs text-slate-400">${v.explanation}</p>
                    <p class="text-xs text-emerald-400 font-mono mt-1"><strong>Fix:</strong> ${v.remediation}</p>
                `;
                vulnList.appendChild(item);
            });
        } else {
            vulnList.innerHTML = '<p class="text-xs text-emerald-400">No major vulnerabilities detected!</p>';
        }

        // Hide Loading & Show Report
        loadingState.classList.add('hidden');
        reportContent.classList.remove('hidden');

    } catch (error) {
        console.error("Audit error:", error);
        alert("Audit run karne mein error aaya. Kripya Terminal mein backend server logs check karein!");
        loadingState.classList.add('hidden');
        placeholderState.classList.remove('hidden');
    }
}