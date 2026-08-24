import 'package:flutter/material.dart';

void main() {
  runApp(const MegenagnaApp());
}

class MegenagnaApp extends StatelessWidget {
  const MegenagnaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Megenagna (መገናኛ)',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF2563EB),
        scaffoldBackgroundColor: const Color(0xFF0B0F19),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF2563EB),
          secondary: Color(0xFFF59E0B),
          surface: Color(0xFF151C2C),
        ),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _currentAddress = 'ET-AA-YK-W03-C2+4Q';
  String _shortCode = 'C2+4Q';
  String _fullCode = '6GXW2RC2+4Q';
  String _admin = 'Addis Ababa (አዲስ አበባ) • Yeka (የካ)';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF2563EB),
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Text(
                'MEGENAGNA',
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 1),
              ),
            ),
            const SizedBox(width: 10),
            const Text(
              'መገናኛ',
              style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFF59E0B)),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.qr_code_scanner),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Opening Offline Door Plaque QR Scanner...')),
              );
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Card(
              color: const Color(0xFF151C2C),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: const BorderSide(color: Color(0xFF232E45)),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('DIGITAL ADDRESS', style: TextStyle(fontSize: 11, color: Colors.grey, letterSpacing: 1)),
                    const SizedBox(height: 4),
                    Text(
                      _currentAddress,
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF38BDF8)),
                    ),
                    const Divider(color: Color(0xFF232E45), height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('SHORT PLUS CODE', style: TextStyle(fontSize: 10, color: Colors.grey)),
                            Text(_shortCode, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFFF59E0B))),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            const Text('GLOBAL PLUS CODE', style: TextStyle(fontSize: 10, color: Colors.grey)),
                            Text(_fullCode, style: const TextStyle(fontSize: 13, fontFamily: 'monospace')),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(_admin, style: const TextStyle(fontSize: 13, color: Colors.white70)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF2563EB),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              icon: const Icon(Icons.qr_code_scanner),
              label: const Text('Scan Municipal Door Plaque'),
              onPressed: () {},
            ),
          ],
        ),
      ),
    );
  }
}
