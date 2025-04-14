from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

class AESCipher:
    def __init__(self, key, iv):
        """初始化 AES 加密器
        
        Args:
            key: 32字节的密钥
            iv: 16字节的初始化向量
        """
        # 确保 key 和 iv 是 bytes 类型
        if isinstance(key, str):
            self.key = key.encode('utf-8')
        else:
            self.key = key
            
        if isinstance(iv, str):
            self.iv = iv.encode('utf-8')
        else:
            self.iv = iv
            
        # 验证密钥长度
        if len(self.key) != 32:
            raise ValueError(f"AES key must be 32 bytes long, got {len(self.key)} bytes")
        if len(self.iv) != 16:
            raise ValueError(f"AES IV must be 16 bytes long, got {len(self.iv)} bytes")
        
    def encrypt_file(self, data):
        """加密文件数据"""
        try:
            # 如果输入是文件对象，读取内容
            if hasattr(data, 'read'):
                data = data.read()
                
            # 确保数据是字节类型
            if not isinstance(data, bytes):
                if isinstance(data, str):
                    data = data.encode('utf-8')
                else:
                    data = bytes(data)
            
            # 使用 PKCS7 填充
            padded_data = pad(data, AES.block_size)
            
            cipher = AES.new(self.key, AES.MODE_CBC, self.iv)
            encrypted_data = cipher.encrypt(padded_data)
            
            return encrypted_data
            
        except Exception as e:
            print(f"Error in encrypt_file: {str(e)}")
            raise

    def decrypt_file(self, encrypted_data):
        """解密文件数据"""
        try:
            cipher = AES.new(self.key, AES.MODE_CBC, self.iv)
            decrypted_data = cipher.decrypt(encrypted_data)
            
            # 移除填充
            try:
                return unpad(decrypted_data, AES.block_size)
            except ValueError as e:
                print(f"Error removing padding: {str(e)}")
                # 如果解填充失败，返回原始解密数据
                return decrypted_data
                
        except Exception as e:
            print(f"Error in decrypt_file: {str(e)}")
            raise 