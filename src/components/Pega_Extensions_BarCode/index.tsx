/* eslint-disable no-unused-vars */
import JsBarcode from 'jsbarcode';
import { Configuration, Flex, FormControl, FormField, ErrorState } from '@pega/cosmos-react-core';
import { useEffect, useRef, useState } from 'react';
import StyledWrapper from './styles';

// eslint-disable-next-line no-shadow
export enum BarcodeType {
  CODE128 = 'CODE128',
  EAN8 = 'EAN8',
  EAN13 = 'EAN13',
  UPC = 'upc',
  CODE39 = 'CODE39',
  ITF14 = 'ITF14',
  MSI = 'MSI',
  PHARMACODE = 'pharmacode'
}

interface BarCodeExtProps {
  format: BarcodeType;
  label: string;
  outputProperty?: string;
  inputProperty: string;
  displayValue: boolean;
  helperText?: string;
  validatemessage?: string;
  hideLabel: boolean;
  testId?: string;
  getPConnect: any;
}

export default function PegaExtensionsBarcode(props: BarCodeExtProps) {
  const {
    label,
    inputProperty,
    format = BarcodeType.CODE128,
    displayValue,
    outputProperty,
    validatemessage,
    hideLabel = false,
    helperText,
    testId,
    getPConnect
  } = props;
  const BarcodeRef = useRef<any>(null);
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().outputProperty;
  const [info, setInfo] = useState(validatemessage || helperText);
  const [status, setStatus] = useState<'success' | 'warning' | 'error' | 'pending' | undefined>(
    undefined
  );

  function updateChanges() {
    const svg = BarcodeRef.current;
    if (svg && propName) {
      const serializer = new XMLSerializer();
      const content = btoa(serializer.serializeToString(svg));
      const blob = `data:image/svg+xml;base64,${content}`;
      if (outputProperty === blob) return;
      actions.updateFieldValue(propName, blob);
    }
  }
  useEffect(() => {
    if (validatemessage !== '') {
      setStatus('error');
    }
    if (status !== 'success') {
      setStatus(validatemessage !== '' ? 'error' : undefined);
    }
    setInfo(validatemessage || helperText);
    BarcodeRef.current.innerHTML = '';
    BarcodeRef.current.style.display = 'none';
    try {
      JsBarcode(BarcodeRef.current, inputProperty, {
        format,
        displayValue,
        width: 2,
        height: 100,
        fontOptions: '',
        font: 'monospace',
        textAlign: 'center',
        textPosition: 'bottom',
        textMargin: 2,
        fontSize: 20,
        background: '#ffffff',
        lineColor: '#000000',
        margin: 10
      });
    } catch (msg: any) {
      setInfo(msg);
      setStatus('error');
    }
    updateChanges();
  }, [inputProperty, displayValue, format, validatemessage, helperText]);

  return (
    <Configuration>
      <Flex container={{ direction: 'column', justify: 'center', alignItems: 'center' }}>
        <FormField
          label={label}
          labelHidden={hideLabel}
          info={info}
          status={status}
          testId={testId}
        >
          <FormControl ariaLabel={label}>
            <StyledWrapper>
              {status === 'error' ? <ErrorState message='Invalid barcode' /> : null}
              <svg ref={BarcodeRef} />
            </StyledWrapper>
          </FormControl>
        </FormField>
      </Flex>
    </Configuration>
  );
}
