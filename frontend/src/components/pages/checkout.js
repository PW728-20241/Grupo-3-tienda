import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Footer from '../common/footer';
import Header from '../common/header';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

const Checkout = ({ userId }) => {
    const [address, setAddress] = useState({ linea1: '', linea2: '', distrito: '', ciudad: '', pais: '' });
    const [paymentMethod, setPaymentMethod] = useState('');
    const [cardNumber, setCardNumber] = useState({ numeroTarjeta: '', nombreTarjeta: '', vencimiento: '', ccv: '' });
    const [shippingMethod, setShippingMethod] = useState('economico');
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(storedCartItems);

        const calculatedSubtotal = storedCartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        const calculatedShippingCost = shippingMethod === 'economico' ? 10 : 17;
        const calculatedTax = calculatedSubtotal * 0.18;
        const calculatedTotal = calculatedSubtotal + calculatedShippingCost + calculatedTax;

        setSubtotal(calculatedSubtotal);
        setShippingCost(calculatedShippingCost);
        setTax(calculatedTax);
        setTotal(calculatedTotal);
    }, [shippingMethod]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddress({ ...address, [name]: value });
    };

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleCreditCardChange = (e) => {
        const { name, value } = e.target;
        setCardNumber({ ...cardNumber, [name]: value });
    };

    const handleShippingMethodChange = (e) => {
        setShippingMethod(e.target.value);
    };

    const handleSubmit = async () => {
        // Validaciones
        let finalizar = true;
        if (!address.linea1 || !address.distrito || !address.ciudad || !address.pais) {
            alert('Por favor, complete todos los campos de dirección.');
            finalizar = false;
            return;
        }
        if (paymentMethod === 'tarjeta' && (!cardNumber.numeroTarjeta || !cardNumber.nombreTarjeta || !cardNumber.vencimiento || !cardNumber.ccv)) {
            alert('Por favor, complete todos los campos de la tarjeta de crédito.');
            finalizar = false;
            return;
        }

        if (finalizar) {
          const direccion = `${address.linea1} | ${address.linea2} | ${address.distrito} | ${address.ciudad} | ${address.pais}`;
          const nroTarjeta = `${cardNumber.numeroTarjeta}, ${cardNumber.nombreTarjeta}, ${cardNumber.vencimiento}, ${cardNumber.ccv}`;
          

            const orderData = {
                direccion,
                metPago: paymentMethod,
                nroTarjeta,
                envio: shippingMethod === 'economico' ? 'Economico' : 'Prioritario',
                productos: cartItems.map(item => ({
                    productoId: item.id,
                    cantidad: item.cantidad,
                    precio: item.precio
                })),
                cuentaTotal: total,
                usuarioId: userId
            };

            try {
                const response = await fetch('/admin/usuarios/${userId}/complete_order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });

                if (response.ok) {
                    console.log('Orden completada');
                    localStorage.removeItem('cartItems');
                    setCartItems([]);
                    // Redirigir a la página de pedidoCompleto si la orden se completó correctamente
                    window.location.href = '/pedidoCompleto';
                } else {
                    console.log('Error al completar la orden');
                }
            } catch (error) {
                console.error('Error al completar la orden:', error);
            }
        }
    };

    return (
        <>
            <Header />
            <Typography variant="h5" component="p">
                ¡Casi listo! Tu orden no estará completa hasta que revises y presiones el botón "Completar la orden" al final de la página
            </Typography>
            <Box component="section" sx={{ p: 1, border: '1px solid black', background: '#C2C1C1' }}>
                Datos de compra
            </Box>
            <Box display={'flex'} justifyContent={'space-evenly'}>
                <BoxDireccion
                    address={address}
                    handleInputChange={handleInputChange}
                />
                <BoxPago
                    paymentMethod={paymentMethod}
                    cardNumber={cardNumber}
                    handlePaymentChange={handlePaymentChange}
                    handleCreditCardChange={handleCreditCardChange}
                />
            </Box>
            <MetodoEnvio
                shippingMethod={shippingMethod}
                handleShippingMethodChange={handleShippingMethodChange}
            />
            <Box display={'flex'} justifyContent={'space-evenly'}>
                <BoxItemsPedido cartItems={cartItems} />
                <BoxResOrd
                    subtotal={subtotal}
                    shippingCost={shippingCost}
                    tax={tax}
                    total={total}
                    shippingMethod={shippingMethod}
                    handleSubmit={handleSubmit}
                />
            </Box>

            <Footer />
        </>
    );
};

function BoxDireccion({ address, handleInputChange }) {
    return (
        <Box
            height={450}
            width={500}
            my={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            p={2}
            sx={{ border: '2px solid grey' }}
        >
            <FormLabel><b>Dirección de Envío*</b></FormLabel>
            <TextField label="Línea 1" name="linea1" value={address.linea1} onChange={handleInputChange} fullWidth required />
            <TextField label="Línea 2" name="linea2" value={address.linea2} onChange={handleInputChange} fullWidth />
            <TextField label="Distrito" name="distrito" value={address.distrito} onChange={handleInputChange} fullWidth required />
            <TextField label="Ciudad" name="ciudad" value={address.ciudad} onChange={handleInputChange} fullWidth required />
            <TextField label="País" name="pais" value={address.pais} onChange={handleInputChange} fullWidth required />
        </Box>
    );
}

function MetodoEnvio({ shippingMethod, handleShippingMethodChange }) {
    return (
        <Box
            my={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={2}
            sx={{ border: '2px solid grey' }}
        >
            <FormLabel><b>Método de Envío</b></FormLabel>
            <RadioGroup value={shippingMethod} onChange={handleShippingMethodChange} sx={{ display: 'flex', flexDirection: 'row' }}>
                <FormControlLabel value="economico" control={<Radio />} label="Envío Económico Aéreo - S/10.00" />
                <FormControlLabel value="prioritario" control={<Radio />} label="Envío Prioritario (5 a 10 días) - S/17.00" />
            </RadioGroup>
        </Box>
    );
}

function BoxPago({ paymentMethod, cardNumber, handlePaymentChange, handleCreditCardChange }) {
  return (
      <Box
          height={450}
          width={500}
          my={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
          p={2}
          sx={{ border: '2px solid grey' }}
      >
          <FormControl component="fieldset">
              <FormLabel><b>Método de Pago*</b></FormLabel>
              <RadioGroup value={paymentMethod} onChange={handlePaymentChange}>
                  <FormControlLabel value="qr" control={<Radio />} label="Pago con Código QR" />
                  <FormControlLabel value="tarjeta" control={<Radio />} label="Pago con Tarjeta de Crédito" />
              </RadioGroup>
          </FormControl>
          {paymentMethod === 'tarjeta' && (
              <>
                  <TextField label="Número de Tarjeta" name="numeroTarjeta" value={cardNumber.numeroTarjeta} onChange={handleCreditCardChange} fullWidth required />
                  <TextField label="Nombre en Tarjeta" name="nombreTarjeta" value={cardNumber.nombreTarjeta} onChange={handleCreditCardChange} fullWidth required />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField label="Vencimiento (MM/YY)" name="vencimiento" value={cardNumber.vencimiento} onChange={handleCreditCardChange} fullWidth required />
                      <TextField label="CCV" name="ccv" value={cardNumber.ccv} onChange={handleCreditCardChange} fullWidth required />
                  </Box>
              </>
          )}
          {paymentMethod === 'qr' && (
              <Box sx={{ mt: 2 }}>
                  <img src="https://www.um.es/documents/4874468/11256784/qr-generico.png/a539bfec-c30c-4f79-a8b7-32871479fffa?t=1546591973294" alt="QR Code" width="200" />
              </Box>
          )}
      </Box>
  );
}

function BoxItemsPedido({ cartItems }) {
  return (
      <Box
          height={450}
          width={500}
          my={2}
          p={2}
          sx={{ border: '2px solid grey', display: 'flex', flexDirection: 'column' }}
      >
          <Typography variant="h5" sx={{ mb: 2 }}>Items del Pedido</Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {cartItems.map(item => (
                  <Box key={item.productoId} sx={{ textAlign: 'center' }}>
                      <Typography variant="body1">
                          {item.nombre} - Cantidad: {item.cantidad} - Precio: S/ {item.precio ? item.precio.toFixed(2) : ''}
                      </Typography>
                  </Box>
              ))}
          </Box>
      </Box>
  );
}

function BoxResOrd({ subtotal, shippingCost, tax, total, shippingMethod, handleSubmit }) {
    return (
        <Box
            height={450}
            width={500}
            my={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={2}
            p={2}
            sx={{ border: '2px solid grey' }}
        >
            <Typography variant="h5">Resumen de la Orden</Typography>
            <Typography variant="body1">Subtotal: S/ {subtotal.toFixed(2)}</Typography>
            <Typography variant="body1">Costo de Envío: S/ {shippingCost.toFixed(2)}</Typography>
            <Typography variant="body1">Impuesto (18%): S/ {tax.toFixed(2)}</Typography>
            <Typography variant="body1">Total a Pagar: S/ {total.toFixed(2)}</Typography>
            <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary" onClick={handleSubmit} href='/pedidoCompleto'>
                    Completar Orden
                </Button>
            </Stack>
        </Box>
    );
}

export default Checkout;