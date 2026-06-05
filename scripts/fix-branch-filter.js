const fs = require('fs')

const files = [
  'src/components/screens/attendance/AttendanceScreen.tsx',
  'src/components/screens/class-sessions/ClassSessionsScreen.tsx',
  'src/components/screens/leave-reserve/LeaveReserveScreen.tsx'
]

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8')
  c = c.replace(/const \[branchFilter, setBranchFilter\] = useState\(''\)/, "const [branchFilter, setBranchFilter] = useState('all')")
  c = c.replace(/branch: branchFilter \|\| undefined,/, "branch: branchFilter === 'all' || !branchFilter ? undefined : branchFilter,")
  fs.writeFileSync(f, c)
  console.log('Fixed', f)
})
