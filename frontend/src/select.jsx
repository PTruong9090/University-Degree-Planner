import React from 'react'
import ReactSelect from 'react-select'

export function SubjectSelect({ options, value, onChange, placeholder = 'Subject…' }) {
  return (
    <ReactSelect
        options={options}
        value={ options.find(o => o.value === value) || null }
        onChange={opt => onChange(opt ? opt.value : '')}
        placeholder={placeholder}
        isClearable
        className="mb-4"
        classNamePrefix="subject-select"
    
        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
        menuPosition="fixed"

        styles={{
            menuPortal: base => ({ ...base, zIndex: 9999 })
        }}
    />
    
  )
}