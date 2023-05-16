import { Button, Result } from 'antd';
import { useNavigate } from "react-router-dom";

export const Check = () => {
    const navigate = useNavigate()

    return (
        <Result
          status="success"
          title="Your manga had been add with success"
          extra={[
            <Button style={{backgroundColor: '#EDDBC6', color: 'black', border: '1px solid rgb(211, 211, 211)'}} onClick={() => navigate('/liste')} type="primary" key="console">
              Go to library
            </Button>,
            <Button onClick={() => navigate('/Post')} key="buy">Add one manga again</Button>,
          ]}
        />
      );
}