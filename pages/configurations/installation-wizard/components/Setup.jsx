import { Button, Space } from 'antd'

const SetUpNewServerStep = ({ handleNextStep, handlePreviusStep }) => {
  return (
    <div>
      <h2>Set Up New Server Step</h2>
      <div className="flex justify-end">
        <Space>
          <Button type="default" onClick={() => handlePreviusStep()}>
            Previous
          </Button>

          <Button type="primary" onClick={() => handleNextStep()}>
            Next
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default SetUpNewServerStep
