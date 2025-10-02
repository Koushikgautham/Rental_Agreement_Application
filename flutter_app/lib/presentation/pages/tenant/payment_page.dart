import 'package:flutter/material.dart';

class PaymentPage extends StatelessWidget {
  final Map<String, dynamic>? paymentData;
  
  const PaymentPage({super.key, this.paymentData});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Payment')),
      body: const Center(child: Text('Payment Page - Coming Soon')),
    );
  }
}