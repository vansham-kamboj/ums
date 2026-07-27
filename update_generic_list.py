import re

with open('frontend/src/components/GenericList.jsx', 'r') as f:
    content = f.read()

# Inside GenericList, extract the user scope
if "const { user } = useAuth();" not in content:
    content = re.sub(
        r"const navigate = useNavigate\(\);",
        "const { user } = useAuth();\n  const navigate = useNavigate();",
        content
    )
    
    if "import { useAuth } from" not in content:
        content = re.sub(
            r"import \{ useToast \} from '\.\.\/context\/ToastContext';",
            "import { useToast } from '../context/ToastContext';\nimport { useAuth } from '../context/AuthContext';",
            content
        )

# Add readOnlyForScopes to props
content = re.sub(
    r"export default function GenericList\(\{ title, endpoint, columns, editPath, createPath, detailPath, subtitle, actions: extraActions, filters: filterConfig, hideCreate, hideDelete \}\) \{",
    "export default function GenericList({ title, endpoint, columns, editPath, createPath, detailPath, subtitle, actions: extraActions, filters: filterConfig, hideCreate, hideDelete, readOnlyForScopes = [] }) {",
    content
)

# Determine if current user is read only
content = re.sub(
    r"const \[sortDir, setSortDir\] = useState\('asc'\);",
    "const [sortDir, setSortDir] = useState('asc');\n  const isReadOnly = user && readOnlyForScopes.includes(user.scope);",
    content
)

# Hide create button if isReadOnly
content = re.sub(
    r"\{\!hideCreate && \(",
    "{(!hideCreate && !isReadOnly) && (",
    content
)

# Hide edit/delete actions if isReadOnly
content = re.sub(
    r"\{\!hideDelete && \(",
    "{(!hideDelete && !isReadOnly) && (",
    content
)

# Replace the edit button 
# Current code uses:
# <Link
#   to={`\${editPath}/\${item.id}`}
#   className="p-1.5 text-text-secondary hover:text-brand-600 rounded-md hover:bg-bg transition-colors"
#   title="Edit"
# >
#   <Edit2 className="w-4 h-4" />
# </Link>

content = re.sub(
    r'<Link\s+to=\{`\$\{editPath\}/\$\{item\.id\}`\}\s+className="p-1\.5 text-text-secondary hover:text-brand-600 rounded-md hover:bg-bg transition-colors"\s+title="Edit"\s*>\s*<Edit2 className="w-4 h-4" />\s*</Link>',
    r'{!isReadOnly && <Link\n                        to={`${editPath}/${item.id}`}\n                        className="p-1.5 text-text-secondary hover:text-brand-600 rounded-md hover:bg-bg transition-colors"\n                        title="Edit"\n                      >\n                        <Edit2 className="w-4 h-4" />\n                      </Link>}',
    content
)

with open('frontend/src/components/GenericList.jsx', 'w') as f:
    f.write(content)

print('Successfully updated GenericList.jsx')
