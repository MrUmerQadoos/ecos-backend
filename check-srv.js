import dns from 'dns/promises';

async function checkSRVRecords() {
  const srvHostname = '_mongodb._tcp.cluster0.ssmia8i.mongodb.net';
  
  console.log(`Checking SRV records for: ${srvHostname}`);
  console.log('='.repeat(50));
  
  try {
    // Check if we can resolve the SRV record
    const records = await dns.resolveSrv(srvHostname);
    console.log('✅ SRV records found:');
    records.forEach((record, i) => {
      console.log(`  ${i + 1}. ${record.name}:${record.port} (priority: ${record.priority}, weight: ${record.weight})`);
    });
    
    // Also check regular A/AAAA records
    console.log('\nChecking regular DNS resolution...');
    const regularRecords = await dns.resolve4('cluster0.ssmia8i.mongodb.net').catch(() => []);
    const aaaaRecords = await dns.resolve6('cluster0.ssmia8i.mongodb.net').catch(() => []);
    
    console.log('A records (IPv4):', regularRecords.length > 0 ? regularRecords : 'None');
    console.log('AAAA records (IPv6):', aaaaRecords.length > 0 ? aaaaRecords : 'None');
    
    if (records.length === 0) {
      console.log('\n⚠️  SRV records exist but are empty. This could indicate:');
      console.log('   - MongoDB Atlas cluster is paused');
      console.log('   - DNS propagation delay');
    }
    
  } catch (error) {
    console.error('❌ Failed to resolve SRV records:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.log('\n🔍 SRV records appear to be blocked or unavailable.');
      console.log('Possible causes:');
      console.log('1. Your ISP is blocking SRV DNS queries');
      console.log('2. Corporate firewall blocking DNS queries');
      console.log('3. MongoDB Atlas cluster DNS not configured');
      console.log('4. Network DNS server issues');
      
      console.log('\n💡 Solution: Use non-SRV connection string');
      console.log('Update MONGO_URI in .env to use mongodb:// instead of mongodb+srv://');
      console.log('Get the non-SRV connection string from MongoDB Atlas → Connect → Drivers');
    }
  }
  
  // Test basic internet connectivity
  console.log('\n' + '='.repeat(50));
  console.log('Testing basic internet connectivity...');
  try {
    await dns.resolve('google.com');
    console.log('✅ Basic DNS resolution works (google.com)');
  } catch (err) {
    console.error('❌ Basic DNS resolution failed:', err.message);
  }
}

checkSRVRecords();