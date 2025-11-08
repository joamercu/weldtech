#!/usr/bin/env node

/**
 * Script para configurar secrets de GitHub Actions
 * 
 * Uso:
 *   node .github/scripts/setup-secrets.js
 * 
 * Requiere:
 *   - GITHUB_TOKEN en variables de entorno
 *   - Repositorio configurado
 */

const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createSecret(token, owner, repo, secretName, secretValue) {
  const crypto = require('crypto');
  const sodium = require('tweetsodium');

  // Obtener la clave pública del repositorio
  const publicKey = await getPublicKey(token, owner, repo);
  
  // Encriptar el secret
  const messageBytes = Buffer.from(secretValue);
  const keyBytes = Buffer.from(publicKey.key, 'base64');
  const encryptedBytes = sodium.seal(messageBytes, keyBytes);
  const encryptedValue = Buffer.from(encryptedBytes).toString('base64');

  // Crear el secret
  const data = JSON.stringify({
    encrypted_value: encryptedValue,
    key_id: publicKey.key_id
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${owner}/${repo}/actions/secrets/${secretName}`,
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, message: `Secret '${secretName}' configurado correctamente` });
        } else {
          reject({ 
            success: false, 
            message: `Error al configurar '${secretName}': ${res.statusCode} - ${body}` 
          });
        }
      });
    });

    req.on('error', (error) => {
      reject({ success: false, message: `Error de red: ${error.message}` });
    });

    req.write(data);
    req.end();
  });
}

async function getPublicKey(token, owner, repo) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${owner}/${repo}/actions/secrets/public-key`,
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Error al obtener clave pública: ${res.statusCode} - ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function main() {
  console.log('🔐 Configurador de Secrets para GitHub Actions\n');
  console.log('⚠️  IMPORTANTE: Este script requiere el paquete tweetsodium');
  console.log('   Instálalo con: npm install tweetsodium\n');

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('❌ Error: GITHUB_TOKEN no está configurado');
    console.log('   Configúralo con: export GITHUB_TOKEN=tu_token');
    process.exit(1);
  }

  const owner = await question('👤 Usuario/Organización de GitHub: ');
  const repo = await question('📦 Nombre del repositorio: ');

  console.log('\n📋 Secrets disponibles para configurar:\n');
  console.log('1. VERCEL_TOKEN');
  console.log('2. VERCEL_ORG_ID');
  console.log('3. VERCEL_PROJECT_ID');
  console.log('4. DATABASE_URL');
  console.log('5. NEXTAUTH_URL');
  console.log('6. NEXTAUTH_SECRET');
  console.log('7. NEXT_PUBLIC_API_URL');
  console.log('8. SSH_HOST (para servidor personalizado)');
  console.log('9. SSH_USERNAME (para servidor personalizado)');
  console.log('10. SSH_PRIVATE_KEY (para servidor personalizado)');
  console.log('11. SSH_PORT (para servidor personalizado)');
  console.log('12. Configurar todos los secrets de Vercel');
  console.log('13. Salir\n');

  const option = await question('Selecciona una opción (1-13): ');

  if (option === '13') {
    console.log('👋 ¡Hasta luego!');
    rl.close();
    return;
  }

  try {
    if (option === '12') {
      // Configurar todos los secrets de Vercel
      const secrets = [
        { name: 'VERCEL_TOKEN', prompt: 'Token de Vercel: ' },
        { name: 'VERCEL_ORG_ID', prompt: 'ID de Organización Vercel: ' },
        { name: 'VERCEL_PROJECT_ID', prompt: 'ID de Proyecto Vercel: ' },
        { name: 'DATABASE_URL', prompt: 'URL de Base de Datos: ' },
        { name: 'NEXTAUTH_URL', prompt: 'URL de NextAuth (ej: https://tu-app.vercel.app): ' },
        { name: 'NEXTAUTH_SECRET', prompt: 'Secret de NextAuth (o presiona Enter para generar uno): ' },
        { name: 'NEXT_PUBLIC_API_URL', prompt: 'URL de API Pública (opcional, presiona Enter para omitir): ' }
      ];

      for (const secret of secrets) {
        let value = await question(`${secret.prompt}`);
        
        if (secret.name === 'NEXTAUTH_SECRET' && !value) {
          // Generar un secret aleatorio
          const crypto = require('crypto');
          value = crypto.randomBytes(32).toString('base64');
          console.log(`   ✅ Secret generado: ${value.substring(0, 20)}...`);
        }

        if (value || secret.name === 'NEXTAUTH_SECRET') {
          const result = await createSecret(token, owner, repo, secret.name, value);
          console.log(`   ✅ ${result.message}`);
        } else {
          console.log(`   ⏭️  Omitido: ${secret.name}`);
        }
      }
    } else {
      const secretMap = {
        '1': { name: 'VERCEL_TOKEN', prompt: 'Token de Vercel: ' },
        '2': { name: 'VERCEL_ORG_ID', prompt: 'ID de Organización Vercel: ' },
        '3': { name: 'VERCEL_PROJECT_ID', prompt: 'ID de Proyecto Vercel: ' },
        '4': { name: 'DATABASE_URL', prompt: 'URL de Base de Datos: ' },
        '5': { name: 'NEXTAUTH_URL', prompt: 'URL de NextAuth: ' },
        '6': { name: 'NEXTAUTH_SECRET', prompt: 'Secret de NextAuth: ' },
        '7': { name: 'NEXT_PUBLIC_API_URL', prompt: 'URL de API Pública: ' },
        '8': { name: 'SSH_HOST', prompt: 'Host SSH: ' },
        '9': { name: 'SSH_USERNAME', prompt: 'Usuario SSH: ' },
        '10': { name: 'SSH_PRIVATE_KEY', prompt: 'Clave Privada SSH: ' },
        '11': { name: 'SSH_PORT', prompt: 'Puerto SSH (default: 22): ' }
      };

      const selected = secretMap[option];
      if (selected) {
        const value = await question(`${selected.prompt}`);
        if (value) {
          const result = await createSecret(token, owner, repo, selected.name, value);
          console.log(`\n✅ ${result.message}`);
        } else {
          console.log('❌ Valor vacío, secret no configurado');
        }
      } else {
        console.log('❌ Opción inválida');
      }
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
  }

  rl.close();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createSecret, getPublicKey };

