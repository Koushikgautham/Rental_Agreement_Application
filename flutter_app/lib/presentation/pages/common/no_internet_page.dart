import 'package:flutter/material.dart';

class NoInternetPage extends StatelessWidget {
  const NoInternetPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('No Internet'),
      ),
      body: const Center(
        child: Text('No Internet Page - Coming Soon'),
      ),
    );
  }
}