import type { Metadata } from 'next'
import Link from 'next/link'
import LegalDocument from '@/components/legal/LegalDocument'

export const metadata: Metadata = {
  title: 'Termos de Uso | Só+1',
  description: 'Conheça as regras para utilizar a plataforma Só+1.',
}

export default function TermosDeUsoPage() {
  return (
    <LegalDocument title="Termos de Uso" description="Estes termos definem as regras para acessar e utilizar os serviços oferecidos pela Só+1.">
      <section><h2>1. Aceitação</h2><p>Ao criar uma conta ou utilizar a Só+1, você declara que leu e concorda com estes Termos de Uso e com a Política de Privacidade. Se não concordar, não utilize a plataforma.</p></section>
      <section><h2>2. O que a Só+1 oferece</h2><p>A Só+1 conecta jogadores, organizadores e espaços esportivos, oferecendo recursos para encontrar e organizar partidas, formar times, avaliar participantes e administrar espaços e assinaturas. A disponibilidade de funcionalidades pode variar ou mudar ao longo do tempo.</p></section>
      <section><h2>3. Cadastro e segurança da conta</h2><p>Você deve fornecer informações verdadeiras, manter seus dados atualizados e proteger suas credenciais. A conta é pessoal e não deve ser cedida. Comunique imediatamente qualquer uso não autorizado pelo e-mail <a href="mailto:contato@so-mais-um.com">contato@so-mais-um.com</a>.</p></section>
      <section>
        <h2>4. Regras de uso</h2><p>Ao usar a plataforma, você se compromete a não:</p>
        <ul><li>praticar fraude, assédio, discriminação, violência ou qualquer ato ilícito;</li><li>publicar conteúdo falso, ofensivo ou que viole direitos de terceiros;</li><li>tentar acessar contas, sistemas ou dados sem autorização;</li><li>interferir no funcionamento, segurança ou integridade da plataforma; ou</li><li>usar automações para coletar dados ou abusar dos serviços sem autorização.</li></ul>
      </section>
      <section><h2>5. Partidas, espaços e interação entre usuários</h2><p>Usuários e parceiros são responsáveis pelas informações que publicam, pela organização das atividades e pelo cumprimento das regras do espaço e das leis aplicáveis. A Só+1 facilita o contato e a organização, mas não integra os acordos firmados diretamente entre usuários, organizadores e espaços esportivos.</p><p>A prática esportiva envolve riscos. Cada participante deve avaliar suas condições, utilizar equipamentos adequados e respeitar as orientações de segurança do local.</p></section>
      <section><h2>6. Planos, pagamentos e cancelamento</h2><p>Recursos pagos, quando disponíveis, terão preço, periodicidade e condições apresentados antes da contratação. Pagamentos podem ser processados pela Stripe. Cancelamentos, reembolsos e renovações observarão a oferta exibida no momento da compra e a legislação aplicável ao consumidor.</p></section>
      <section><h2>7. Conteúdo e propriedade intelectual</h2><p>A plataforma, sua marca, código, design e conteúdo próprio são protegidos por direitos de propriedade intelectual. Você mantém os direitos sobre o conteúdo que envia e autoriza a Só+1 a armazená-lo, processá-lo e exibi-lo na medida necessária para prestar o serviço.</p></section>
      <section><h2>8. Moderação, suspensão e encerramento</h2><p>Podemos remover conteúdo, limitar recursos ou suspender contas diante de indícios de violação destes termos, risco à segurança, fraude ou obrigação legal. Sempre que adequado, consideraremos a gravidade, a recorrência e a possibilidade de esclarecimento. Você pode pedir o encerramento da conta pelo canal de contato.</p></section>
      <section><h2>9. Disponibilidade e responsabilidade</h2><p>Trabalhamos para manter o serviço seguro e disponível, mas interrupções, manutenções e falhas de terceiros podem ocorrer. Na extensão permitida pela legislação, a Só+1 não se responsabiliza por atos de usuários ou parceiros, nem por acordos realizados fora da plataforma. Nada nestes termos exclui direitos ou responsabilidades que a lei não permita limitar.</p></section>
      <section><h2>10. Privacidade</h2><p>O tratamento de dados pessoais é explicado na <Link href="/politica-de-privacidade">Política de Privacidade</Link>, que integra estes termos.</p></section>
      <section><h2>11. Alterações</h2><p>Podemos atualizar estes termos para refletir mudanças no serviço ou na legislação. A data no início identifica a versão vigente, e mudanças relevantes poderão ser comunicadas pelos canais disponíveis. O uso após a entrada em vigor da nova versão representa sua aceitação, ressalvados os direitos previstos em lei.</p></section>
      <section><h2>12. Legislação e contato</h2><p>Estes termos são regidos pelas leis brasileiras. Fica preservado o direito do consumidor de recorrer ao foro legalmente competente. Dúvidas e solicitações podem ser enviadas para <a href="mailto:contato@so-mais-um.com">contato@so-mais-um.com</a>.</p></section>
    </LegalDocument>
  )
}
