import { formatEther } from '@ethersproject/units';
import { useBalance } from 'eth-hooks';
import { BigNumber } from 'ethers';
import React, { FC, useEffect, useState } from 'react';
import './Balance.css';

interface IBalanceProps {
  address: string | undefined;
  price?: number;
  balance?: BigNumber;
  dollarMultiplier?: number;
  size?: 'short' | 'long';
  fontSize?: number;
  padding?: string | number;
}

/**
 * Displays a balance of given address in ether & dollar
 *
  ~ Features ~

  - Provide address={address} and get balance corresponding to given address
  - Provide provider={mainnetProvider} to access balance on mainnet or any other network (ex. localProvider)
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide fontSize and padding to set thes css properties of the wrapper span
 * @param props
 * @returns (FC)
 */
export const Balance: FC<IBalanceProps> = (props) => {
  const [dollarMode, setDollarMode] = useState(true);
  const [balance] = useBalance(props.address);
  const [value, setValue] = useState('');

  useEffect(() => {
    let resolvedBalance = BigNumber.from(balance ?? 0);
    if (props.balance != null) {
      resolvedBalance = BigNumber.from(props.balance);
    }

    let floatBalance = parseFloat('0.00');
    if (resolvedBalance) {
      const etherBalance = formatEther(resolvedBalance);
      floatBalance = parseFloat(etherBalance);
    }

    let display = floatBalance.toFixed(4);
    const price = props.price ?? props.dollarMultiplier;
    if (price && dollarMode) {
      display = '$' + (floatBalance * price).toFixed(2);
    }
    setValue(display);
  }, [balance, dollarMode, props.balance, props.dollarMultiplier, props.price]);

  return (
    <span
      className="Balance"
      style={{
        verticalAlign: 'middle',
        fontSize: props.fontSize ?? 24,
        padding: props.padding ?? 8,
        cursor: 'pointer',
      }}
      onClick={(): void => {
        setDollarMode(!dollarMode);
      }}>
      {value}
    </span>
  );
};
