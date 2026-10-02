"""
Módulo para detectar la dirección IP local de la máquina en la red local.
NEO Producciones
"""
import socket
import sys

def obtenerIpLocal() -> str:
    """
    Obtiene la dirección IPv4 local asignada por el router Wi-Fi o Ethernet.
    Utiliza una conexión UDP dummy sin transferir datos para identificar la interfaz activa.
    """
    try:
        conector = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        conector.connect(('8.8.8.8', 80))
        direccionIp = conector.getsockname()[0]
        conector.close()
        return direccionIp
    except Exception:
        try:
            return socket.gethostbyname(socket.gethostname())
        except Exception:
            return "127.0.0.1"

if __name__ == "__main__":
    sys.stdout.write(obtenerIpLocal())
