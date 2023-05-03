import { Button, Result } from 'antd';
import { useNavigate } from "react-router-dom";

export const Check = () => {
    const navigate = useNavigate()

    return (
        <Result
          style={{marginTop: "3%"}}
          status="success"
          title="Your manga had been add with success"
          extra={[
            <Button onClick={() => navigate('/')} type="primary" key="console">
              Go to library
            </Button>,
            <Button onClick={() => navigate('/Post')} key="buy">Add one manga again</Button>,
          ]}
        />
      );
}