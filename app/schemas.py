from pydantic import BaseModel, Field
from typing import List

class CodeAuditRequest(BaseModel):
    code: str = Field(..., description="Source code snippet to audit")
    language: str = Field(default="python", description="Programming language of the code")

class VulnerabilityItem(BaseModel):
    issue: str
    severity: str
    line_or_location: str
    explanation: str
    remediation: str

class CodeAuditResponse(BaseModel):
    security_score: int
    risk_level: str
    summary: str
    vulnerabilities: List[VulnerabilityItem]
    fixed_code: str