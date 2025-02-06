import React from 'react'
import GlobalButton from '../atoms/GlobalButton'
import InputField from '../atoms/InputField'
import styled from '@emotion/styled'

type InputAreaProps = {
    value: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    placeholder: string
    onClick: () => void
}

const InputArea = ({ value, onChange, placeholder, onClick }: InputAreaProps) => {
  return (
    <Wrapper>
        <InputField value={value} onChange={onChange} placeholder={placeholder} />
        <GlobalButton text={'전송'} onClick={onClick} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-width: 50%;
    max-height: 30px;
`

export default InputArea