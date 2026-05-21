import subprocess
import os

replacements = {
    'US-ACC-01': 'US-SYS-04-01',
    'US-ACC-02': 'US-SYS-04-02',
    'US-ACC-03': 'US-SYS-05-01',
    'US-ACC-04': 'US-SYS-04-03'
}

files = [
    ('US-ACC-01-thiet-lap-topic-nhom-quyen-be-db.md', 'US-SYS-04-01-thiet-lap-topic-nhom-quyen.md', 
"""---
id: US-SYS-04-01
title: Thiết lập topic và nhóm quyền trên BE/DB
domain: IAM/AuthZ
status: core
tags: [iam, authz, role, topic]
---

# US-SYS-04-01 - Thiết lập topic và nhóm quyền trên BE/DB

> **Tuân thủ Tiêu chuẩn:** 
> - `[POLICY-IAM-01]` Tách bạch hệ thống quyền (Entitlement) khỏi hệ thống quản lý tài khoản.
> - `[POLICY-IAM-03]` RBAC+ABAC.

> **Phạm vi:"""),

    ('US-ACC-02-thiet-lap-thanh-vien-gan-nhom-quyen-be-db.md', 'US-SYS-04-02-gan-nhom-quyen-thanh-vien.md',
"""---
id: US-SYS-04-02
title: Thiết lập thành viên và gán nhóm quyền trên BE/DB
domain: IAM/AuthZ
status: core
tags: [iam, authz, member, assign]
---

# US-SYS-04-02 - Thiết lập thành viên và gán nhóm quyền trên BE/DB

> **Tuân thủ Tiêu chuẩn:** 
> - `[POLICY-IAM-03]` Cấp quyền qua Role, không cấp trực tiếp cho User.
> - `[POLICY-MDM-03]` Gán quyền cho User Account, không gán vào Worker hay Person.

> **Phạm vi:"""),

    ('US-ACC-03-login-nap-dung-quyen-topic-duoc-gan.md', 'US-SYS-05-01-login-nap-quyen.md',
"""---
id: US-SYS-05-01
title: Login nạp đúng quyền, topic và phạm vi đã được gán
domain: IAM/AuthN
status: core
tags: [iam, authn, login, session]
---

# US-SYS-05-01 - Login nạp đúng quyền, topic và phạm vi đã được gán

> **Tuân thủ Tiêu chuẩn:** 
> - `[POLICY-IAM-02]` Default Deny. Quyền mặc định là rỗng. Chỉ nạp các Role đang Active.

> **Phạm vi:"""),

    ('US-ACC-04-ap-dung-data-scope-va-record-sharing.md', 'US-SYS-04-03-ap-dung-data-scope.md',
"""---
id: US-SYS-04-03
title: Áp dụng data scope và record sharing khi tải dữ liệu
domain: IAM/AuthZ
status: core
tags: [iam, authz, data-scope, acl]
---

# US-SYS-04-03 - Áp dụng data scope và record sharing khi tải dữ liệu module

> **Tuân thủ Tiêu chuẩn:** 
> - `[POLICY-ORG-01]` Bộ lọc dữ liệu theo ngữ cảnh tổ chức. Mọi query list data phải có Scope Filter.
> - `[POLICY-IAM-04]` Chính sách Record Sharing (ACL).

> **Phạm vi:"""),
]

for old_name, new_name, header in files:
    cmd = ['git', 'show', f'HEAD:docs/business-functions/{old_name}']
    result = subprocess.run(cmd, capture_output=True)
    if result.returncode != 0:
        print(f'Failed to get {old_name}')
        continue
    
    text = result.stdout.decode('utf-8')
    
    for old_ref, new_ref in replacements.items():
        text = text.replace(old_ref, new_ref)
        
    parts = text.split('> **Phạm vi:', 1)
    if len(parts) == 2:
        new_text = header + parts[1]
    else:
        new_text = text
        
    with open(f'docs/business-functions/{new_name}', 'w', encoding='utf-8') as f:
        f.write(new_text)

print('Restored and refactored!')
