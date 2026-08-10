import type { Metadata } from 'next'
import LegalDocument from '@/components/legal/LegalDocument'

export const metadata: Metadata = {
  title: 'Política de Privacidade | Só+1',
  description: 'Saiba como a Só+1 trata e protege seus dados pessoais.',
}

export default function PoliticaDePrivacidadePage() {
  return (
    <LegalDocument title="Política de Privacidade" description="Este documento explica quais dados pessoais a Só+1 utiliza, para quais finalidades e quais são os seus direitos.">
      <section>
        <h2>1. Quem controla seus dados</h2>
        <p>A Só+1 é a controladora dos dados pessoais tratados na plataforma. A Equipe Só+1 responde pelo canal de privacidade e recebe solicitações pelo e-mail <a href="mailto:contato@so-mais-um.com">contato@so-mais-um.com</a>.</p>
      </section>
      <section>
        <h2>2. Dados que tratamos</h2>
        <p>Dependendo de como você usa a plataforma, podemos tratar:</p>
        <ul>
          <li>nome, apelido, e-mail, telefone, foto e identificadores da conta;</li>
          <li>senha protegida por hash e dados necessários à autenticação, inclusive pelo Google;</li>
          <li>modalidades, partidas, avaliações, notificações e demais interações na plataforma;</li>
          <li>dados de espaços esportivos, responsáveis, agenda e chave Pix informada pelo parceiro;</li>
          <li>dados de assinatura, pagamento e cobrança processados pelos nossos fornecedores; e</li>
          <li>dados técnicos, como registros de acesso, endereço IP, navegador e dispositivo.</li>
        </ul>
      </section>
      <section>
        <h2>3. Por que utilizamos esses dados</h2>
        <p>Usamos os dados para criar e proteger contas; organizar partidas e espaços; processar assinaturas; enviar comunicações operacionais e, quando autorizado, marketing; prevenir fraude; cumprir obrigações; e melhorar o produto.</p>
        <p>Conforme a finalidade, o tratamento pode se apoiar na execução do contrato, no cumprimento de obrigação legal ou regulatória, no exercício regular de direitos, no legítimo interesse avaliado pela Só+1 ou no seu consentimento, quando necessário.</p>
      </section>
      <section>
        <h2>4. Compartilhamento e operadores</h2>
        <p>Compartilhamos apenas o necessário para operar a plataforma. Atualmente utilizamos Google para autenticação, Stripe para pagamentos, Resend para envio de e-mails, Neon para banco de dados, Railway para infraestrutura da API e Vercel para hospedagem da aplicação e do site. Esses fornecedores tratam dados segundo seus próprios termos e as instruções aplicáveis aos serviços contratados.</p>
        <p>Também podemos compartilhar dados quando exigido por lei, ordem de autoridade competente ou para proteger direitos e a segurança da Só+1, dos usuários e de terceiros.</p>
      </section>
      <section>
        <h2>5. Transferências internacionais</h2>
        <p>Alguns fornecedores podem armazenar ou processar dados fora do Brasil. Nesses casos, buscamos serviços que ofereçam medidas adequadas de proteção e mecanismos compatíveis com a legislação aplicável.</p>
      </section>
      <section>
        <h2>6. Retenção e eliminação</h2>
        <p>Mantemos os dados enquanto a conta estiver ativa e pelo período necessário às finalidades descritas, obrigações legais e regulatórias, prevenção de fraude e exercício ou defesa de direitos. Os prazos variam conforme a natureza do dado e a obrigação aplicável.</p>
        <p>Tokens de redefinição de senha expiram em uma hora e convites de parceiros expiram em sete dias. A expiração impede seu uso; registros técnicos podem permanecer pelo tempo necessário à segurança, auditoria e cumprimento de obrigações. Sem motivo legítimo para conservação, os dados serão eliminados ou anonimizados.</p>
      </section>
      <section>
        <h2>7. Seus direitos</h2>
        <p>Nos termos da LGPD, você pode solicitar confirmação do tratamento, acesso, correção, anonimização, bloqueio ou eliminação de dados desnecessários ou irregulares, portabilidade quando regulamentada, informação sobre compartilhamentos e consequências de não consentir, revogação do consentimento e revisão de decisões automatizadas, quando aplicável.</p>
        <p>Para exercer um direito, escreva para <a href="mailto:contato@so-mais-um.com">contato@so-mais-um.com</a>. Podemos pedir informações adicionais para confirmar sua identidade e proteger sua conta.</p>
      </section>
      <section>
        <h2>8. Segurança e incidentes</h2>
        <p>Adotamos medidas técnicas e administrativas para reduzir riscos de acesso não autorizado, perda, alteração ou divulgação indevida. Nenhum serviço é completamente imune a riscos; em incidentes relevantes, seguiremos as obrigações legais de avaliação e comunicação.</p>
      </section>
      <section>
        <h2>9. Crianças e adolescentes</h2>
        <p>A plataforma não é dirigida a crianças. O tratamento de dados de crianças e adolescentes, quando identificado, deverá observar seu melhor interesse e os requisitos legais aplicáveis. Responsáveis podem solicitar providências pelo canal de privacidade.</p>
      </section>
      <section>
        <h2>10. Alterações desta política</h2>
        <p>Podemos atualizar esta política para refletir mudanças legais, técnicas ou no produto. A data no início indica a versão vigente, e alterações relevantes poderão ser comunicadas pelos canais disponíveis na plataforma.</p>
      </section>
    </LegalDocument>
  )
}
