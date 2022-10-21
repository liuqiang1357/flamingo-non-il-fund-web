import { Loading3QuartersOutlined } from '@ant-design/icons';
import { Spin as AntSpin } from 'antd';
import { ComponentProps, FC } from 'react';

export const Spin: FC<ComponentProps<typeof AntSpin>> = props => {
  return <AntSpin indicator={<Loading3QuartersOutlined spin />} {...props} />;
};
