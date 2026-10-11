import React from 'react'
import { Controller } from 'react-hook-form'
export default function Field({ control, name, component: Component, ...props }) {
    return <Controller control={control} name={name} render={({ field }) => <Component {...props} name={name} input={field} />} />
}

