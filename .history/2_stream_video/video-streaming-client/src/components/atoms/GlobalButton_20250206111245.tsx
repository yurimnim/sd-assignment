  

export type ButtonProps = {
  text: string;
  onClick?: () => void;
};

const GlobalButton: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <>
    <Button primary onClick={onClick}>
      {text}
    </Button>
    </>
  );
};

export default GlobalButton;