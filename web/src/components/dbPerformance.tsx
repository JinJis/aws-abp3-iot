import Container from "@awsui/components-react/container";
import Header from "@awsui/components-react/header";
import SpaceBetween from "@awsui/components-react/space-between";
import React, {Component, useState} from 'react';
import Button from "@awsui/components-react/button";
import Form from "@awsui/components-react/form";
import FormField from "@awsui/components-react/form-field";
import Select, {SelectProps} from "@awsui/components-react/select";
import {DataGrid, GridColDef, GridSelectionModel} from '@mui/x-data-grid';
import axios from "axios";
import {Chip} from "@mui/material";

const columns: GridColDef[] = [
  {field: 'id', headerName: 'ID', width: 80, headerAlign: 'center', align: 'center',},
  {field: 'thingName', headerName: 'Thing Name', width: 150, headerAlign: 'center', align: 'center',},
  {field: 'thingArn', headerName: 'Thing ARN', width: 200, headerAlign: 'center', align: 'center',},
  {field: 'thingTypeName', headerName: 'Thing Type', width: 150, headerAlign: 'center', align: 'center',},
  {field: 'timestamp', headerName: 'Timestamp', width: 150, headerAlign: 'center', align: 'center'},
  {
    field: 'temperature',
    headerName: 'Temperature',
    width: 180,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
  },
  {
    field: 'latency',
    headerName: 'Latency (sec)',
    width: 120,
    headerAlign: 'center',
    align: 'center',
  },
];

let deviceSelectionModels: GridSelectionModel = []

const FormLoader = () => {
  const [selectValue, setSelectValue] = useState<SelectProps.Option | null>(null);
  const [deviceList, setDeviceList] = useState([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [iotCoreStartTime, setIotCoreStartTime] = useState<number>(0)
  const [iotCoreEndTime, setIotCoreEndTime] = useState<number>(0)

  const fetchAllDevices = () => {
    // @ts-ignore
    let result = []
    let params = {
      maxResults: 250,
    }
    setIotCoreStartTime(Date.now())
    for (const _ of Array(20).keys()) {
      axios.get('https://ferxqgjut5.execute-api.ap-northeast-2.amazonaws.com/Prod/devices', {
        params: params,
        withCredentials: false,
      })
        .then((response) => {
          response.data.things.forEach((item: any, index: any) => {
            item.id = item.attributes.thingId
          });
          // update device list
          // @ts-ignore
          result = [...result, ...response.data.things]
          if (response.data.nextToken) {
            // @ts-ignore
            params.nextToken = response.data.nextToken
            setNextToken(response.data.nextToken)
          }
          // @ts-ignore
          setDeviceList(result)
          setIotCoreEndTime(Date.now())
        })
        .catch(err => {
          console.log(err)
          // @ts-ignore
          return
        })
    }
  }

  const fetchNextTokenDevices = () => {
    setIotCoreStartTime(Date.now())
    axios.get('https://ferxqgjut5.execute-api.ap-northeast-2.amazonaws.com/Prod/devices', {
      params: {
        maxResults: 100,
        nextToken: nextToken
      },
      withCredentials: false,
    })
      .then((response) => {
        setIotCoreEndTime(Date.now())
        response.data.things.forEach((item: any, index: any) => {
          item.id = item.attributes.thingId
        });
        // update device list
        const newList = [...deviceList, ...response.data.things]
        // @ts-ignore
        setDeviceList(newList)
      })
      .catch(err => console.log(err))
  }
  const fetchMaxNumDevices = () => {
    setIotCoreStartTime(Date.now())
    axios.get('https://ferxqgjut5.execute-api.ap-northeast-2.amazonaws.com/Prod/devices', {
      params: {
        maxResults: 100
      },
      withCredentials: false,
    })
      .then((response) => {
        setIotCoreEndTime(Date.now())
        response.data.things.forEach((item: any, index: any) => {
          item.id = item.attributes.thingId
        });
        // update device list
        setDeviceList(response.data.things)
        // Update Next Token
        if (response.data.nextToken) setNextToken(response.data.nextToken)

      })
      .catch(err => console.log(err))
  }

  const fetchDeviceTopics = () => {
    setIotCoreStartTime(Date.now())
    axios.get('https://ferxqgjut5.execute-api.ap-northeast-2.amazonaws.com/Prod/devices/topic', {
      params: {
        ids: deviceSelectionModels.toString()
      },
      withCredentials: false,
    })
      .then((response) => {
        setIotCoreEndTime(Date.now())
        const endTime = Date.now()
        const newDeviceList = deviceList.map((x) => {
          response.data.forEach((item: any, _: any) => {
            // @ts-ignore
            if (x.thingName === item.thing_name) {
              // @ts-ignore
              x.timestamp = item.timestamp
              // @ts-ignore
              x.temperature = item.temperature
              // @ts-ignore
              x.latency = Math.round(((endTime / 1000) - item.timestamp) * 100) / 100
            }
          })
          return x;
        });
        // @ts-ignore
        setDeviceList(newDeviceList)
      })
      .catch(err => console.log(err))
  }

  const DataTable = () => {
    return (
      <div style={{height: 950, width: '100%'}}>
        {
          deviceSelectionModels.length > 0 ?
            <DataGrid
              rows={deviceList}
              columns={columns}
              pageSize={15}
              rowsPerPageOptions={[15]}
              selectionModel={deviceSelectionModels}
              checkboxSelection
              onSelectionModelChange={(newSelectionModel) => {
                deviceSelectionModels = newSelectionModel
              }}
            /> : <DataGrid
              rows={deviceList}
              columns={columns}
              pageSize={15}
              rowsPerPageOptions={[15]}
              checkboxSelection
              onSelectionModelChange={(newSelectionModel) => {
                if (newSelectionModel.length > 0) {
                  deviceSelectionModels = newSelectionModel
                }
              }}
            />
        }
      </div>
    );
  }

  return (
    <>
      <SpaceBetween direction="vertical" size="xxl">
        <Form
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Chip
                label={`${iotCoreEndTime - iotCoreStartTime > 0 ? iotCoreEndTime - iotCoreStartTime : "-"} ms`}
                color="warning"
              />
              <Button
                variant="primary"
                onClick={() => {
                  // Option 1
                  if (selectValue?.value == "option-1") {
                    fetchMaxNumDevices()
                  }
                  // Option 2
                  if (selectValue?.value == "option-2") {
                    fetchAllDevices()
                  }
                }}
                disabled={!selectValue}>Submit
              </Button>
              <Button
                variant="normal"
                onClick={() => {
                  fetchNextTokenDevices()
                }}
                disabled={!nextToken}>+100
              </Button>
              <Button
                variant="normal"
                iconName="refresh"
                onClick={() => {
                  fetchDeviceTopics()
                }}
                disabled={!nextToken}>Update Topic
              </Button>
            </SpaceBetween>
          }
        >
          <Container>
            <SpaceBetween direction="vertical" size="l">
              <FormField label="Query Options" errorText={!selectValue && "Please select a value"}>
                <Select
                  options={[
                    {
                      label: "Fetch Devices (100 per call)",
                      value: "option-1"
                    },
                    {
                      label: "Fetch All Devices (5,000 at once)",
                      value: "option-2"
                    },
                  ]}
                  selectedOption={selectValue}
                  onChange={(event) => setSelectValue(event.detail.selectedOption)}
                  selectedAriaLabel="selected"
                />
              </FormField>
            </SpaceBetween>
          </Container>
        </Form>
        <DataTable/>
      </SpaceBetween>
    </>
  );
};


class DBPerformancePage extends Component {
  render() {
    return <Container header={<Header variant="h2">DB Performance</Header>}>
      <SpaceBetween direction="vertical" size="l">
        <FormLoader/>
      </SpaceBetween>
    </Container>
  }
}

export default DBPerformancePage;
