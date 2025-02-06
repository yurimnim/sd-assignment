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
    align-items: stretch;
    justify-content: center;
    gap: 10px;
    min-width: 50%;
    height: 50px;
    border-radius: 5px;
    margin: 50px 0;
`

export default InputArea