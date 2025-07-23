export class JwtConstants {
  static secret = String(process.env.JWT_SECRET);
}
