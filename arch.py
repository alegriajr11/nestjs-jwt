# Desescalar las predicciones futuras para obtener las ventas reales
ventas_futuras_reales = scaler.inverse_transform(ventas_futuras_scaled.reshape(-1, 1))

# Crear un DataFrame con los años futuros y las ventas desescaladas
predicciones_futuras_reales = pd.DataFrame({'Año': [2025, 2026], 'Ventas Globales Predichas': ventas_futuras_reales.flatten()})
print(predicciones_futuras_reales)
